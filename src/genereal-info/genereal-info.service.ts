import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGenerealInfoDto } from './dto/create-genereal-info.dto';
import { UpdateGenerealInfoDto } from './dto/update-genereal-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetGeneralInfoDto } from './dto/get-general-info.dto';

@Injectable()
export class GenerealInfoService {
  constructor(private readonly prisma: PrismaService){}
  async create(createGenerealInfoDto: CreateGenerealInfoDto) {  
    try {
      return await this.prisma.generalInfo.create({ data: createGenerealInfoDto })
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('links')) throw new ConflictException('link already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('phones')) throw new ConflictException('phone already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) throw new ConflictException('email already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('telegramId')) throw new ConflictException('telegramId already exists');
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }
  
  async findAll(query: GetGeneralInfoDto) {
    const { search, skip = 1, take = 10, sortBy, sortOrder = 'asc' } = query
    try {
      return await this.prisma.generalInfo.findMany({
        where: {
          ...(search && {
            OR: [
              {
                email: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                phones: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                telegramId: {
                  contains: search,
                  mode: 'insensitive'
                }
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
      const findone = await this.prisma.generalInfo.findFirst({ where: { id }})
      if(!findone) throw new BadRequestException('General-info not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateGenerealInfoDto: UpdateGenerealInfoDto) {
    try {
      const findone = await this.prisma.generalInfo.findFirst({ where: { id }})
      if(!findone) throw new BadRequestException('General-info not found')
      return await this.prisma.generalInfo.update({ where: { id }, data: updateGenerealInfoDto })
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('telegramId')) throw new ConflictException('telegramId already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) throw new ConflictException('email already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('phones')) throw new ConflictException('phone already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('links')) throw new ConflictException('link already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.generalInfo.findFirst({ where: { id }})
      if(!findone) throw new BadRequestException('General-info not found')
      return await this.prisma.generalInfo.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
