import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetBrandDto } from './dto/get-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService){}
  async create(createBrandDto: CreateBrandDto) {
    try {
      return await this.prisma.brand.create({ data: createBrandDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetBrandDto) {
    const { search, skip = 1, take = 10, sortBy = 'name_uz', sortOrder } = query
    try {
      return await this.prisma.brand.findMany({
        where: {
          ...(search && {
            OR: [
              { 
                name_uz: {
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
                name_en: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
          })
        },
        skip: ( Number(skip) - 1 ) * Number(take),
        take: Number(take),
        orderBy: {
          [sortBy]: sortOrder
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.brand.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Brand not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      const findone = await this.prisma.brand.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Brand not found')
      return await this.prisma.brand.update({ where: { id }, data: updateBrandDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.brand.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Brand not found')
      
      return await this.prisma.brand.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
