import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';
import { UpdateMasterOrderDto } from './dto/update-master-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MasterOrderService {
  constructor(private readonly prisma: PrismaService){}
  async create(createMasterOrderDto: CreateMasterOrderDto) {
    try {
      const masters = await Promise.all(
        createMasterOrderDto.masterId.map(async masterId => {
          const findone = await this.prisma.master.findFirst({ where: { id: masterId }})
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

  async findAll() {
    try {
      return await this.prisma.masterOrder.findMany();
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
          masterId.map(async (mId) => await this.prisma.master.findFirst({ where: { id: mId } }))
        );
        const notFound = masters.some(m => m === null);
        if (notFound) throw new BadRequestException('One or more masters not found');
  
        const currentOrderId = orderId || existingMasterOrder.orderId;
        const findOrder = await this.prisma.order.findFirst({ where: { id: currentOrderId } });
        if (!findOrder) throw new BadRequestException('Order not found');
  
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
