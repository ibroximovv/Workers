import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRegoinDto } from './dto/create-regoin.dto';
import { UpdateRegoinDto } from './dto/update-regoin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetRegionDto } from './dto/get-region.dto';

@Injectable()
export class RegoinService {
  constructor(private readonly prisma: PrismaService){}
  async create(createRegoinDto: CreateRegoinDto) {
    try {
      const findone = await this.prisma.region.findFirst({ 
        where: {
          OR: [
            { name_uz: createRegoinDto.name_uz },
            { name_ru: createRegoinDto.name_ru },
            { name_en: createRegoinDto.name_en },
          ]
        }
      })
      if (findone) throw new BadRequestException('a region with this name was previously used')
      return await this.prisma.region.create({ data: createRegoinDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetRegionDto) {
    const { search, skip = 1, take = 10, sortBy = 'name_uz', sortOrder } = query
    try {
      return await this.prisma.region.findMany({
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
      const findone = await this.prisma.region.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Region not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateRegoinDto: UpdateRegoinDto) {
    try {
      const findone = await this.prisma.region.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Region not found')
      const findonename = await this.prisma.region.findFirst({ 
        where: {
          OR: [
            { name_uz: updateRegoinDto.name_uz },
            { name_ru: updateRegoinDto.name_ru },
            { name_en: updateRegoinDto.name_en },
          ]
        }
      })
      if (findonename) throw new BadRequestException('a region with this name was previously used')
      return await this.prisma.region.update({ where: { id }, data: updateRegoinDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.region.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Region not found')
      return await this.prisma.region.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
