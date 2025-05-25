import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService){}
  async create(createProductDto: CreateProductDto) {
    try {
      const { levels, tools, ...productData } = createProductDto
      if (levels && levels.length > 0) {
        for( const level of levels ) {
          const exists = await this.prisma.level.findFirst({ where: { id: level.levelId }})
          if(!exists) throw new BadRequestException('level not found')
        }
      }

      if (tools && tools.length > 0) {
        for( const toolId of tools ) {
          const exists = await this.prisma.tool.findFirst({ where: { id: toolId }})
          if(!exists) throw new BadRequestException('tool not found')
        }
      }

      const newProduct = await this.prisma.product.create({ data: { ...productData }})
      if (levels && levels.length > 0) {
        await this.prisma.productLevel.createMany({
          data: levels.map(level => ({
            productId: newProduct.id,
            levelId: level.levelId,
            priceHourly: level.priceHourly,
            priceDaily: level.priceDaily,
            minWorkingHours: level.minWorkingHours
          }))
        })
      }

      if (tools && tools.length > 0) {
        await this.prisma.productTool.createMany({
          data: tools.map(toolId => ({
            productId: newProduct.id,
            toolId: toolId
          }))
        })
      }
      return newProduct; 
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[])?.join(', ') || 'unknown field';
          throw new BadRequestException(`Duplicate value for unique field(s): ${target}`);
        }
      }
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetProductDto) {
    const {search, skip = 1, take = 10, sortBy, sortOrder = 'asc', levelId, toolId, isActive = true} = query
    try {
      return await this.prisma.product.findMany({
        where: {
          ...(search && {
            OR: [
              { 
                name_en: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              { 
                name_ru: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              { 
                name_uz: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
            ]
          }),
          ...(isActive !== undefined ? { isActive }: {}),
          ...(levelId ? {
            ProductLevel: {
              some: {
                ...(levelId && { levelId })
              }
            }
          }: {}),
          ...(toolId ? {
            ProductTool: {
              some: {
                ...(toolId && { toolId })
              }
            }
          }: {}),
        },
        include: {
          ProductLevel: {
            select: {
              id: true,
              priceDaily: true,
              priceHourly: true,
              minWorkingHours: true
            }
          },
          ProductTool: {
            select: {
              id: true,
              Tool: {
                select: {
                  id: true,
                  name_uz: true,
                  quantity: true,
                  price: true,
                }
              }
            }
          }
        },
        skip: (Number(skip) - 1) * Number(take),
        take: Number(take),
        orderBy: sortBy ? { [sortBy]: sortOrder, } : undefined,
      });
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      return findone;
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id } });
      if (!findone) throw new BadRequestException('Product not found');
  
      const { levels, tools, ...productData } = updateProductDto;

      if (levels && levels.length > 0) {
        for (const level of levels) {
          const exists = await this.prisma.level.findFirst({ where: { id: level.levelId } });
          if (!exists) throw new BadRequestException('Level not found');
        }
      }
  
      if (tools && tools.length > 0) {
        for (const toolId of tools) {
          const exists = await this.prisma.tool.findFirst({ where: { id: toolId } });
          if (!exists) throw new BadRequestException('Tool not found');
        }
      }
  
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: productData,
      });
  
      await this.prisma.productLevel.deleteMany({ where: { productId: id } });
      await this.prisma.productTool.deleteMany({ where: { productId: id } });
  
      if (levels && levels.length > 0) {
        await this.prisma.productLevel.createMany({
          data: levels.map(level => ({
            productId: id,
            levelId: level.levelId,
            priceHourly: level.priceHourly,
            priceDaily: level.priceDaily,
            minWorkingHours: level.minWorkingHours
          }))
        });
      }
  
      if (tools && tools.length > 0) {
        await this.prisma.productTool.createMany({
          data: tools.map(toolId => ({
            productId: id,
            toolId: toolId
          }))
        });
      }
  
      return updatedProduct;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }  

  async remove(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      await this.prisma.productTool.deleteMany({ where: { productId: id } });
      await this.prisma.productLevel.deleteMany({ where: { productId: id } });
      
      return await this.prisma.product.delete({ where: { id }}); 
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
