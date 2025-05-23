import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService){}
  async create(createOrderDto: CreateOrderDto, user: any) {
    try {
      const { products, tools, ...orderData } = createOrderDto;
  
      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          total: 0,
          userId: user.id
        }
      });
  
      let totalOrderPrice = 0;
  
      if (products && products.length > 0) {
        await Promise.all(products.map(async (product) => {
          const { productId, levelId, count, quantity, measure } = product;
  
          const findprd = await this.prisma.product.findFirst({ where: { id: productId } });
          if (!findprd) throw new BadRequestException('Product not found');
  
          const findlev = await this.prisma.productLevel.findFirst({ where: { AND: [{ levelId }, { productId }]} });
          if (!findlev) throw new BadRequestException('Level not found');
  
          let total = 0;
          if (measure === 'HOUR') {
            total = count * (quantity * findlev.priceHourly);
          } else if (measure === 'DAY') {
            total = count * (quantity * findlev.priceDaily);
          }
  
          totalOrderPrice += total;
  
          await this.prisma.productOrder.create({
            data: {
              orderId: order.id,
              productId,
              levelId,
              count,
              quantity,
              measure,
              total
            }
          });
        }));
      }
  
      if (tools && tools.length > 0) {
        await Promise.all(tools.map(async (tool) => {
          const { count, toolId } = tool;
  
          const findtool = await this.prisma.tool.findFirst({ where: { id: toolId } });
          if (!findtool) throw new BadRequestException('Tool not found');
  
          if (findtool.quantity < count) {
            throw new BadRequestException(`Maximum ${findtool.quantity} ta buyurtma qilish mumkin`);
          }
  
          const total = count * findtool.price;
          totalOrderPrice += total;
  
          await this.prisma.toolOrder.create({
            data: {
              count,
              toolId,
              total,
              orderId: order.id
            }
          });
        }));
      }

      return await this.prisma.order.update({
        where: { id: order.id },
        data: { total: totalOrderPrice }
      }); // minWorkingHours
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }  

  async findAll(user: any) {
    try {
      return await this.prisma.order.findMany({
        where: {
          userId: user.id
        },
        include: {
          ProductOrder: {
            select: {
              level: {
                select: {
                  ProductLevel: true
                }
              }
            }
          },
          ToolOrder: true
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.order.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Order not found')
      return await this.prisma.order.findFirst({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server')
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const findone = await this.prisma.order.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Order not found')
      return await this.prisma.order.update({ where: { id }, data: updateOrderDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.order.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Order not found')
      const deleted = await this.prisma.order.delete({ where: { id }})
      await this.prisma.order.update({ where: { id }, data: {
        status: 'VOID'
      }})
      
      return deleted;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server')
    }
  }
}
