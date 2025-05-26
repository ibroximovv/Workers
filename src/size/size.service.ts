import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetSizeDto } from './dto/get-size.dto';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService){}
  async create(createSizeDto: CreateSizeDto) {
    try {
      return await this.prisma.size.create({ data: createSizeDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetSizeDto) {
    const { search, skip = 1, take = 10, sortBy = 'name_uz', sortOrder } = query
    try {
      return await this.prisma.size.findMany({
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
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.size.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Size not found')
      return findone;
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    try {
      const findone = await this.prisma.size.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Size not found')
      return await this.prisma.size.update({ where: { id }, data: updateSizeDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.size.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Size not found')
      return await this.prisma.size.delete({ where: { id }});
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
