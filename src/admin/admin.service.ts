import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService){}
  async create(createUserDto: CreateUserDto) {
    try {
      const findone = await this.prisma.user.findFirst({ where: {
        OR: [
          {
            phone: createUserDto.phone,
          },
          {
            email: createUserDto.email
          }, 
          {
            fullname: createUserDto.fullname
          }
        ]
      }})
      if (findone) throw new BadRequestException('User already exists')
        const region = await this.prisma.region.findFirst({
          where: { id: createUserDto.regionId },
        });
        if (!region) throw new BadRequestException('Region not found');
      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10)
      return await this.prisma.user.create({ data: {
        ...createUserDto,
        password: hashedPassword
      }});
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('phone')) throw new ConflictException('phone already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) throw new ConflictException('email raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetUserDto) {
    const { search, skip = 1, take = 10, sortBy, sortOrder = 'asc', regionId, role } = query
    try {
      return await this.prisma.user.findMany({
        where: {
          ...(search && {
            OR: [
              {
                fullname: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                phone: {
                  contains: search,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ]
          }),
          ...(regionId && { regionId }),
          ...(role && { role })
        },
        include: {
          Region: {
            select: {
              id: true,
              name_en: true,
              name_ru: true,
              name_uz: true
            }
          }
        },
        omit: { regionId: true },
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
      const findone  = await this.prisma.user.findFirst({ where: { id }, 
        include: {
          Region: {
            select: {
              id: true,
              name_en: true,
              name_ru: true,
              name_uz: true
            }
          }
        },
        omit: { regionId: true },
      })
      if (!findone) throw new BadRequestException('User not found')
      return await this.prisma.user.findFirst({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const findone  = await this.prisma.user.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('User not found')
      if(updateUserDto.regionId) {
        const region = await this.prisma.region.findUnique({
          where: { id: updateUserDto.regionId },
        });
        if (!region) throw new BadRequestException('Region not found');
      }
      let hashedPassword = findone.password
      if(updateUserDto.password) {
        hashedPassword = bcrypt.hashSync(updateUserDto.password, 10)
      }
      return await this.prisma.user.update({ where: { id }, data: {...updateUserDto, password: hashedPassword }});
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('phone')) throw new ConflictException('phone already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) throw new ConflictException('email raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone  = await this.prisma.user.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('User not found')
      return await this.prisma.user.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
