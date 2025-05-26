import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';
import { UpdateMasterOrderDto } from './dto/update-master-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMasterOrderDto } from './dto/get-master-order.dto';

@Injectable()
export class MasterOrderService {
  constructor(private readonly prisma: PrismaService){}
  async create(createMasterOrderDto: CreateMasterOrderDto) {
    try {
      const masters = await Promise.all(
        createMasterOrderDto.masterId.map(async masterId => {
          const findone = await this.prisma.master.findFirst({ where: { AND: [{ id: masterId }, { isActive: true }] }})
          return findone
        })
      )
      const notFound = masters.some(master => master === null);
      if (notFound) {
        throw new BadRequestException('One or more masters not found');
      }
      const findorder = await this.prisma.order.findFirst({ where: { id: createMasterOrderDto.orderId }})
      if (!findorder) throw new BadRequestException('Order not found')
      
      return await Promise.all(
        createMasterOrderDto.masterId.map(async masterId =>{
          const findone = await this.prisma.masterOrder.findFirst({ where: { AND: [
            { orderId: createMasterOrderDto.orderId },
            { masterId: masterId }
          ]}})
          if(findone) throw new BadRequestException('Master-order already exists')
          await this.prisma.master.update({ where: { id: masterId }, data: { isActive: false }})
          return await this.prisma.masterOrder.create({
            data: {
              masterId: masterId,
              orderId: createMasterOrderDto.orderId
            }
          })
        })
      ) // countini tekshirish kk
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll(query: GetMasterOrderDto) {
    const { skip = 1, take = 10, masterId, orderId } = query
    try {
      return await this.prisma.masterOrder.findMany({
        where: {
          ...(masterId && { masterId }),
          ...(orderId && { orderId }),
        },
        include: {
          Master: {
            select: {
              id: true,
              fullName: true,
              isActive: true,
              ProductMaster: {
                select: {
                  priceDaily: true,
                  priceHourly: true,
                  minWorkingHours: true
                }
              }
            }
          },
          Order: {
            select: {
              id: true,
              User: {
                select: {
                  id: true,
                  fullname: true,
                  phone: true,
                  role: true,
                  Region: {
                    select: {
                      name_uz: true
                    }
                  }
                }
              },
              location: true,
              address: true,
              withDelivery: true,
              paymentType: true,
              status: true
            }
          },
        },
        omit: { orderId: true },
        skip: (Number(skip) - 1) * Number(take),
        take: Number(take),
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.masterOrder.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Master-order not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateMasterOrderDto: UpdateMasterOrderDto) {
    try {
      const { masterId, orderId } = updateMasterOrderDto;
  
      const existingMasterOrder = await this.prisma.masterOrder.findFirst({ where: { id } });
      if (!existingMasterOrder) {
        throw new BadRequestException('Master-order not found');
      }
  
      if ((!masterId || masterId.length === 0) && orderId) {
        const findOrder = await this.prisma.order.findFirst({ where: { id: orderId } });
        if (!findOrder) throw new BadRequestException('Order not found');
  
        return await this.prisma.masterOrder.update({
          where: { id },
          data: { orderId }
        });
      }
  
      if (Array.isArray(masterId) && masterId.length > 0) {
        const masters = await Promise.all(
          masterId.map(async (mId) => await this.prisma.master.findFirst({ where: { AND: [{ id: mId }, { isActive: true }] } }))
        );
        const notFound = masters.some(m => m === null);
        if (notFound) throw new BadRequestException('One or more masters not found');
  
        const currentOrderId = orderId || existingMasterOrder.orderId;
        const findOrder = await this.prisma.order.findFirst({ where: { id: currentOrderId } });
        if (!findOrder) throw new BadRequestException('Order not found');
  
        const oldMasterOrders = await this.prisma.masterOrder.findMany({
          where: { orderId: currentOrderId },
          select: { masterId: true }
        });
  
        const oldMasterIds = oldMasterOrders.map(mo => mo.masterId);
  
        await this.prisma.master.updateMany({
          where: { id: { in: oldMasterIds } },
          data: { isActive: true }
        });
  
        await this.prisma.master.updateMany({
          where: { id: { in: masterId } },
          data: { isActive: false }
        });
  
        await this.prisma.masterOrder.deleteMany({ where: { orderId: currentOrderId } });
  
        return await Promise.all(
          masterId.map(mId =>
            this.prisma.masterOrder.create({
              data: {
                masterId: mId,
                orderId: currentOrderId,
              },
            })
          )
        );
      }
  
      throw new BadRequestException('At least masterId or orderId must be provided');
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }  

  async remove(id: string) {
    try {
      const findone = await this.prisma.masterOrder.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Master-order not found')
      return await this.prisma.masterOrder.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
