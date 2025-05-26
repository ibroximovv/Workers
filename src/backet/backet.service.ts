import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetBacketDto } from './dto/get-backet.dto';

@Injectable()
export class BacketService {
  constructor(private readonly prisma: PrismaService){}
  async create(createBacketDto: CreateBacketDto, user: any) {
    try {
      const { product, toolId, quantity } = createBacketDto;
  
      const isProductValid = product?.productId && product?.levelId;
      const isToolValid = !!toolId;
  
      if (!isProductValid && !isToolValid) {
        throw new BadRequestException('Either product+level or toolId must be provided');
      }
      if (isProductValid && isToolValid) {
        throw new BadRequestException('Only one of product+level or toolId should be provided');
      }
  
      const [foundProduct, foundLevel, foundTool] = await Promise.all([
        isProductValid
          ? this.prisma.product.findFirst({ where: { id: product.productId } })
          : Promise.resolve(null),
        isProductValid
          ? this.prisma.level.findFirst({ where: { id: product.levelId } })
          : Promise.resolve(null),
        isToolValid
          ? this.prisma.tool.findFirst({ where: { id: toolId } })
          : Promise.resolve(null)
      ]);
  
      if (isProductValid && (!foundProduct || !foundLevel)) {
        throw new BadRequestException('Product or level not found');
      }
      if (isToolValid && !foundTool) {
        throw new BadRequestException('Tool not found');
      }
  
      let backet = await this.prisma.backet.findFirst({
        where: { userId: user.id }
      });
  
      if (!backet) {
        backet = await this.prisma.backet.create({
          data: {
            userId: user.id,
            total: 0
          }
        });
      }
  
      const existing = await this.prisma.backetItem.findFirst({
        where: {
          productId: isProductValid ? product.productId : null,
          levelId: isProductValid ? product.levelId : null,
          toolId: isToolValid ? toolId : null,
          userId: user.id,
          backetId: backet.id
        }
      });
  
      if (existing) {
        throw new BadRequestException('Backet item already exists');
      }
  
      let total = 0;
  
      if (isProductValid) {
        const productLevel = await this.prisma.productLevel.findFirst({
          where: {
            productId: product.productId,
            levelId: product.levelId
          }
        });
  
        if (!productLevel) {
          throw new BadRequestException('ProductLevel relation not found');
        }
  
        total = productLevel.priceDaily * quantity;
      } else if (isToolValid && foundTool) {
        if (quantity > foundTool.quantity) {
          throw new BadRequestException(`Maximum quantity: ${foundTool.quantity}`);
        }
        total = foundTool.price * quantity;
      }
  
      const data: any = {
        userId: user.id,
        quantity,
        total,
        backetId: backet.id
      };
  
      if (isProductValid) {
        data.productId = product.productId;
        data.levelId = product.levelId;
      }
      if (isToolValid) {
        data.toolId = toolId;
      }
  
      await this.prisma.backetItem.create({ data });
  
      const allItems = await this.prisma.backetItem.findMany({
        where: { backetId: backet.id }
      });
  
      const totalSum = allItems.reduce((acc, item) => acc + item.total, 0);
  
      await this.prisma.backet.update({
        where: { id: backet.id },
        data: { total: totalSum }
      });
  
      return { message: 'Item added successfully', backetTotal: totalSum };
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }
  
  async findAll(user: any, query: GetBacketDto) {
    const { skip = 1, take = 10, sortOrder = 'asc', sortBy, levelId, productId, toolId } = query
    try {
      return await this.prisma.backet.findMany({
        where: { 
          userId: user.id,
          ...(productId || levelId || toolId ? {
            BacketItem: {
              some: {
                ...(productId && { productId }),
                ...(levelId && { levelId }),
                ...(toolId && { toolId })
              }
            }
          }: {}),
        },
        include: {
          BacketItem: {
            select: {
              Product: {
                select: {
                  id: true,
                  name_uz: true,
                  name_en: true,
                  name_ru: true,
                  isActive: true
                }
              },
              Level: {
                select: {
                  id: true,
                  ProductLevel: {
                    select: {
                      priceDaily: true,
                      priceHourly: true
                    }
                  },
                }
              },
              Tool: {
                select: {
                  id: true,
                  price: true,
                  quantity: true,
                  Size: {
                    select: {
                      name_uz: true,
                    }
                  },
                  Brand: {
                    select: {
                      name_uz: true,
                    }
                  },
                  Capacity: {
                    select: {
                      name_uz: true
                    }
                  }
                }
              },
              total: true,
            }
          },
        },
        skip: (Number(skip) - 1) * Number(take),
        take: Number(take),
        orderBy: sortBy ? { [sortBy]: sortOrder, } : undefined,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.backetItem.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Backet not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateBacketDto: UpdateBacketDto) {
    try {
      const item = await this.prisma.backetItem.findFirst({ where: { id } });
      if (!item) throw new BadRequestException('Backet item not found');
  
      let { quantity } = updateBacketDto;
  
      if (!quantity || quantity <= 0) quantity = item.quantity;
  
      let newTotal = item.total;
  
      if (item.productId && item.levelId) {
        const productLevel = await this.prisma.productLevel.findFirst({
          where: {
            productId: item.productId,
            levelId: item.levelId
          }
        });
        if (!productLevel) throw new BadRequestException('ProductLevel not found');
        // if() 
        newTotal = productLevel.priceDaily * quantity;
      }
  
      if (item.toolId) {
        const tool = await this.prisma.tool.findFirst({ where: { id: item.toolId } });
        if (!tool) throw new BadRequestException('Tool not found');
        if (quantity > tool.quantity) throw new BadRequestException(`Maximum quantity: ${tool.quantity}`);
        newTotal = tool.price * quantity;
      }
  
      await this.prisma.backetItem.update({
        where: { id },
        data: {
          quantity,
          total: newTotal
        }
      });
  
      const allItems = await this.prisma.backetItem.findMany({
        where: { backetId: item.backetId }
      });
  
      const totalSum = allItems.reduce((acc, i) => acc + i.total, 0);
  
      await this.prisma.backet.update({
        where: { id: item.backetId },
        data: { total: totalSum }
      });
  
      return { message: 'Item updated successfully', backetTotal: totalSum };
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }

  async remove(id: string) {
    try {
      const item = await this.prisma.backetItem.findFirst({ where: { id } });
      if (!item) throw new BadRequestException('Backet item not found');
  
      await this.prisma.backetItem.delete({ where: { id } });
  
      const remainingItems = await this.prisma.backetItem.findMany({
        where: { backetId: item.backetId }
      });
  
      const newTotal = remainingItems.reduce((sum, i) => sum + i.total, 0);
  
      await this.prisma.backet.update({
        where: { id: item.backetId },
        data: { total: newTotal }
      });
  
      return { message: 'Item removed successfully', backetTotal: newTotal };
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }  
}
