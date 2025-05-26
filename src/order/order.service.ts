import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetOrderDto } from './dto/get-order.dto';
import axios from 'axios';

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

          if(!findprd.isActive) throw new BadRequestException('Product isActive = false')
  
          const findlev = await this.prisma.productLevel.findFirst({ where: { AND: [{ levelId }, { productId }]} });
          if (!findlev) throw new BadRequestException('Level not found');
  
          let total = 0;
          if (measure === 'HOUR') {
            if(findprd.minWorkingHours > quantity) throw new BadRequestException(`you can't order, because minWorkingHours = ${findprd.minWorkingHours}`)
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

          if (!findtool.isActive) throw new BadRequestException('Tool isActive = false')
  
          if (findtool.quantity < count) {
            throw new BadRequestException(`Maximum ${findtool.quantity} ta buyurtma qilish mumkin`);
          }
          
          const total = count * findtool.price;
          totalOrderPrice += total;

          await this.prisma.tool.update({ where: { id: toolId }, data: {
            quantity: findtool.quantity - count
          }})
  
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

      const generalInfo = await this.prisma.generalInfo.findFirst(); 
      if (generalInfo && generalInfo.telegramId) {
        const message = `Order created!\n\nID: ${order.id}\nUser ID: ${order.userId}\nTotalPrice: ${totalOrderPrice} so'm`;

        await axios.post('https://api.telegram.org/bot7892941710:AAEFWiFkzTvNBPZfffl0uiJp70EHBnbyKR8/sendMessage', {
          chat_id: generalInfo.telegramId,
          text: message
        });
      }

      return await this.prisma.order.update({
        where: { id: order.id },
        data: { total: totalOrderPrice }
      }); 
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }  

  async findAll( query: GetOrderDto) {
    const { search, skip = 1, take = 10, sortBy, sortOrder = 'asc', productId, levelId, toolId, paymentType, status } = query
    try {
      return await this.prisma.order.findMany({
        where: {
          NOT: {
            status: 'FINISHED'
          },
          ...(search && {
            OR: [
              {
                commentToDelivery: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                address: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ] 
          }),
          ...(status && {
            status: status, 
          }),
        
          ...(paymentType && {
            paymentType: paymentType, 
          }),

          ...(productId || levelId ? {
            ProductOrder: {
              some: {
                ...(productId && { productId }),
                ...(levelId && { levelId })
              }
            }
          }: {}),

          ...(toolId  ? {
            ToolOrder: {
              some: {
                ...(toolId && { toolId })
              }
            }
          }: {}),
        },
        include: {
          ProductOrder: {
            select: {
              id: true,
              count: true,
              measure: true,
              quantity: true,
              Product: {
                select: {
                  id: true,
                  name_uz: true,
                  name_en: true,
                  name_ru: true,
                  isActive: true
                }
              },
              level: {
                select: {
                  id: true,
                  name_uz: true,
                  ProductLevel: {
                    select: {
                      priceHourly: true,
                      priceDaily: true,
                    }
                  }
                }
              }, 
              total: true
            }
          },
          ToolOrder: {
            select: {
              Tool: {
                select: {
                  id: true,
                  name_uz: true,
                  name_en: true,
                  name_ru: true,
                  code: true,
                  price: true,
                  isActive: true
                }
              },
              total: true
            },
          },
          Comment: {
            select: {
              id: true,
              message: true
            }
          }
        },
        skip: (Number(skip) - 1) * Number(take),
        take: Number(take),
        orderBy: sortBy ? { [sortBy]: sortOrder, } : undefined,
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
      const order = await this.prisma.order.findFirst({ where: { id } });
      if (!order) throw new BadRequestException('Order not found');
  
      const { products, tools, ...orderData } = updateOrderDto;
  
      let totalOrderPrice = 0;
  
      await this.prisma.order.update({
        where: { id },
        data: orderData,
      });
  
      if (products) {
        await this.prisma.productOrder.deleteMany({ where: { orderId: id } });
  
        for (const product of products) {
          const { productId, levelId, count, quantity, measure } = product;
  
          const findprd = await this.prisma.product.findFirst({ where: { id: productId } });
          if (!findprd) throw new BadRequestException('Product not found');
          if (!findprd.isActive) throw new BadRequestException('Product isActive = false');
  
          const findlev = await this.prisma.productLevel.findFirst({ where: { AND: [{ levelId }, { productId }] } });
          if (!findlev) throw new BadRequestException('Level not found');
  
          let total = 0;
          if (measure === 'HOUR') {
            if (findprd.minWorkingHours > quantity)
              throw new BadRequestException(`you can't order, because minWorkingHours = ${findprd.minWorkingHours}`);
            total = count * (quantity * findlev.priceHourly);
          } else if (measure === 'DAY') {
            total = count * (quantity * findlev.priceDaily);
          }
  
          totalOrderPrice += total;
  
          await this.prisma.productOrder.create({
            data: {
              orderId: id,
              productId,
              levelId,
              count,
              quantity,
              measure,
              total,
            },
          });
        }
      }
  
      if (tools) {
        await this.prisma.toolOrder.deleteMany({ where: { orderId: id } });
  
        for (const tool of tools) {
          const { toolId, count } = tool;
  
          const findtool = await this.prisma.tool.findFirst({ where: { id: toolId } });
          if (!findtool) throw new BadRequestException('Tool not found');
          if (!findtool.isActive) throw new BadRequestException('Tool isActive = false');
          if (findtool.quantity < count)
            throw new BadRequestException(`Maximum ${findtool.quantity} ta buyurtma qilish mumkin`);
  
          const total = count * findtool.price;
          totalOrderPrice += total;
  
          await this.prisma.tool.update({
            where: { id: toolId },
            data: { quantity: findtool.quantity - count },
          });
  
          await this.prisma.toolOrder.create({
            data: {
              orderId: id,
              toolId,
              count,
              total,
            },
          });
        }
      }
  
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { total: totalOrderPrice },
      });
  
      return updatedOrder;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }  

  async remove(id: string) {
  try {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: {
        ToolOrder: true, 
      },
    });

    if (!order) throw new BadRequestException('Order not found');

    for (const toolOrder of order.ToolOrder) {
      const tool = await this.prisma.tool.findFirst({ where: { id: toolOrder.toolId } });
      if (tool) {
        await this.prisma.tool.update({
          where: { id: toolOrder.toolId },
          data: {
            quantity: tool.quantity + toolOrder.count,
          },
        });
      }
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: 'VOID',
      },
    });

    return updated;

  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new InternalServerErrorException(error.message || 'Internal server');
  }
}

}
