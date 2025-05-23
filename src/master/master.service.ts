import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    try {
      return await this.prisma.master.findMany();
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
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
      return await this.prisma.master.delete({ where: { id }}); // + errorHandling relation db deleted
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
