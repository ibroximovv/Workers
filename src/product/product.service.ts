import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { exists } from 'fs';
import { Prisma } from '@prisma/client';

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
      return newProduct; // + errorHandling
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

  async findAll() {
    try {
      return await this.prisma.product.findMany();
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
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      return await this.prisma.product.update({ where: { id }, data: updateProductDto }); // + errorHandling and relation's corrected
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.product.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Product not found')
      return await this.prisma.product.delete({ where: { id }}); // + errorHandling and relation's deleted
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
