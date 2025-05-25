import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMasterDto } from './dto/get-master.dto';
import { omit } from 'lodash';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService){}
  async create(createMasterDto: CreateMasterDto) {
    try {
      const { products, ...masterData } = createMasterDto
      const findone = await this.prisma.master.findFirst({ where: { phone: createMasterDto.phone } })
      if (findone) throw new BadRequestException('Master already exists')
      const newMaster = await this.prisma.master.create({ data: {
        ...masterData
      }})

      if(products && products.length > 0) {
        await this.prisma.productMaster.createMany({
          data: products.map(element => ({
            masterId: newMaster.id,
            productId: element.productId,
            levelId: element.levelId,
            priceHourly: element.priceHourly,
            priceDaily: element.priceDaily,
            minWorkingHours: element.minWorkingHours,
            experience: element.experience
          }))
        })
      }

      return newMaster;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('fullName')) throw new ConflictException('fullName already exists');
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetMasterDto) {
    const {
      search,
      skip = 1,
      take = 10,
      isActive = true,
      levelId,
      productId,
      sortBy,
      sortOrder = 'asc',
    } = query;
  
    try {
      const masters = await this.prisma.master.findMany({
        where: {
          ...(search && {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } }
            ]
          }),
          ...(isActive !== undefined ? { isActive }: {}),
          ...(levelId || productId
            ? {
                ProductMaster: {
                  some: {
                    ...(productId && { productId }),
                    ...(levelId && { levelId }),
                  },
                },
              }
            : {}),
        },
        
        include: {
          ProductMaster: {
            select: {
              id: true,
              minWorkingHours: true,
              priceHourly: true,
              priceDaily: true,
              experience: true,
              Product: {
                select: {
                  id: true,
                  name_uz: true,
                  ProductLevel: {
                    select: {
                      id: true,
                      priceHourly: true,
                      priceDaily: true,
                      minWorkingHours: true,
                    },
                  },
                },
              },
            },
          },
          Star: {
            select: {
              star: true,
            },
          },
        },
        skip: (Number(skip) - 1) * Number(take),
        take: Number(take),
        orderBy: sortBy
          ? {
              [sortBy]: sortOrder,
            }
          : undefined,
      });
  
      const modifiedMasters = masters.map((master) => {
        const averageStar =
          master.Star.length > 0
            ? master.Star.reduce((sum, curr) => sum + curr.star, 0) /
              master.Star.length
            : null;
  
        const cleanMaster = omit(master, ['Star']);
  
        return {
          ...cleanMaster,
          averageStar,
        };
      });
  
      return modifiedMasters;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.master.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Master not found')
      return findone;
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateMasterDto: UpdateMasterDto) {
    try {
      const findone = await this.prisma.master.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Master not found')
      return await this.prisma.master.update({ where: { id }, data: updateMasterDto }); // + errorHandling relation db correcting
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.master.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Master not found')
      const findmasterorder = await this.prisma.masterOrder.findFirst({ where: { masterId: id }})
      if(findmasterorder) throw new BadRequestException('this master masterorder relational ')
      return await this.prisma.master.delete({ where: { id }}); // + errorHandling relation db deleted
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
