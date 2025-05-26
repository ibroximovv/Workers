import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateMyProfileDto } from './dto/update-my-profile';
import * as bcrypt from "bcrypt";

@Injectable()
export class MyProfileService {
    constructor(private readonly prisma: PrismaService){}

    async getMyOrders(user: any) {
        try {
            return await this.prisma.order.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    ProductOrder: {
                      select: {
                        id: true,
                        count: true,
                        // measure: true,
                        // quantity: true,
                        Product: {
                          select: {
                            id: true,
                            name_uz: true,
                            name_en: true,
                            name_ru: true,
                            isActive: true
                          }
                        },
                        level: {
                          select: {
                            id: true,
                            name_uz: true,
                            ProductLevel: {
                              select: {
                                priceHourly: true,
                                priceDaily: true,
                              }
                            }
                          }
                        }, 
                        total: true
                      }
                    },
                    ToolOrder: {
                      select: {
                        Tool: {
                          select: {
                            id: true,
                            name_uz: true,
                            name_en: true,
                            name_ru: true,
                            code: true,
                            price: true,
                            isActive: true,
                          },
                        },
                        total: true
                      }
                    },
                    Comment: {
                      select: {
                        id: true,
                        message: true
                      }
                    }
                },
            })
        } catch (error) {
            if (error instanceof BadRequestException) throw error
            throw new IntersectionObserver(error.message || 'Internal server error')
        }
    }

    async getMyProfile(user: any) {
        try {
            return await this.prisma.user.findFirst({
                where: {
                    id: user.id,
                },
            })
        } catch (error) {
            if (error instanceof BadRequestException) throw error
            throw new IntersectionObserver(error.message || 'Internal server error')
        }
    }

    async getMyBacket(user: any) {
        try {
            return await this.prisma.backet.findFirst({
                where: {
                    userId: user.id
                },
                include: {
                    BacketItem: {
                        select: {
                            id: true,
                            Product: {
                                select: {
                                    name_uz: true,
                                }
                            },
                            Tool: {
                                select: {
                                    name_uz: true,
                                    code: true,
                                    description_uz: true
                                }
                            },
                            total: true
                        }
                    }
                }
            })
        } catch (error) {
            if (error instanceof BadRequestException) throw error
            throw new IntersectionObserver(error.message || 'Internal server error')
        }
    }

    async updateMyProfile(user: any, data: UpdateMyProfileDto) {
        try {
            const findone = await this.prisma.user.findFirst({ where: { id: user.id }})
            if (!findone) throw new BadRequestException('User not found')
            
            let hashedPassword = findone.password
            if( data.password ) {
                hashedPassword = bcrypt.hashSync(data.password, 10)
            }

            return await this.prisma.user.update({ where: { id: user.id }, data: {
                ...data,
                password: hashedPassword
            }})

        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) throw new ConflictException('email already exists');
            if (error.code === 'P2002' && error.meta?.target?.includes('phone')) throw new ConflictException('phone already exists');
            if (error instanceof BadRequestException) throw error
            throw new IntersectionObserver(error.message || 'Internal server error')
        }
    }

    async deleteMyProfile(user: any) {
        try {
            const findone = await this.prisma.user.findFirst({ where: { id: user.id }})
            if (!findone) throw new BadRequestException('User not found')
            return await this.prisma.user.delete({ where: { id: user.id }})
        } catch (error) {
            if (error instanceof BadRequestException) throw error
            throw new IntersectionObserver(error.message || 'Internal server error')
        }
    }
}
