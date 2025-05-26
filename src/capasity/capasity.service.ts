import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCapasityDto } from './dto/create-capasity.dto';
import { UpdateCapasityDto } from './dto/update-capasity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCapasityDto } from './dto/get-capasity.dto';

@Injectable()
export class CapasityService {
  constructor(private readonly prisma: PrismaService){}
  async create(createCapasityDto: CreateCapasityDto) {
    try {
      return await this.prisma.capasity.create({ data: createCapasityDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetCapasityDto) {
    const { search, skip = 1, take = 10, sortBy = 'name_uz', sortOrder } = query
    try {
      return await this.prisma.capasity.findMany({
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
      const findone = await this.prisma.capasity.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('capasity not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateCapasityDto: UpdateCapasityDto) {
    try {
      const findone = await this.prisma.capasity.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('capasity not found')
      return await this.prisma.capasity.update({ where: { id }, data: updateCapasityDto });
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
      const findone = await this.prisma.capasity.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('capasity not found')
      return await this.prisma.capasity.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
