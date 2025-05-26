import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetShowcaseDto } from './dto/get-showcase.dto';

@Injectable()
export class ShowcaseService {
  constructor(private readonly prisma: PrismaService){}
  async create(createShowcaseDto: CreateShowcaseDto) {
    try {
      return await this.prisma.showcase.create({ data: createShowcaseDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('description_uz')) throw new ConflictException('description_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('description_ru')) throw new ConflictException('description_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('description_en')) throw new ConflictException('description_en raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetShowcaseDto) {
    const { search, skip = 1, take = 10, sortBy, sortOrder = 'asc' } = query
    try {
      return await this.prisma.showcase.findMany({
        where: {
          ...(search && {
            OR: [
              {
                name_en: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
              {
                name_uz: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
              {
                name_ru: {
                  contains: search,
                  mode: 'insensitive'
                },
              },
            ]
          })
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
      const findone = await this.prisma.showcase.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('ShowCase not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateShowcaseDto: UpdateShowcaseDto) {
    try {
      const findone = await this.prisma.showcase.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('ShowCase not found')
      return await this.prisma.showcase.update({ where: { id }, data: updateShowcaseDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('description_uz')) throw new ConflictException('description_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('description_ru')) throw new ConflictException('description_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('description_en')) throw new ConflictException('description_en raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.showcase.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('ShowCase not found')
      return await this.prisma.showcase.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
