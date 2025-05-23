import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService){}
  async create(createPartnerDto: CreatePartnerDto) {
    try {
      const findone = await this.prisma.partners.findFirst({ where: {
        OR: [
          { image: createPartnerDto.image },
          { link: createPartnerDto.link }
        ]
      }})
      if (findone) throw new BadRequestException('Image or link already exists')
      return await this.prisma.partners.create({ data: createPartnerDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || InternalServerErrorException)
    }
  }

  async findAll() {
    try {
      return await this.prisma.partners.findMany()
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || InternalServerErrorException)
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.partners.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Partner not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || InternalServerErrorException)
    }
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto) {
    try {
      const findone = await this.prisma.partners.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Partner not found')

      const findOne = await this.prisma.partners.findFirst({ where: {
        OR: [
          { image: updatePartnerDto.image },
          { link: updatePartnerDto.link }
        ]
      }})
      if (findOne) throw new BadRequestException('Image or link already exists')
      return await this.prisma.partners.update({ where: { id }, data: updatePartnerDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('name_uz')) throw new ConflictException('name_uz already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_ru')) throw new ConflictException('name_ru raqami already exists');
      if (error.code === 'P2002' && error.meta?.target?.includes('name_en')) throw new ConflictException('name_en raqami already exists');
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || InternalServerErrorException)
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.partners.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Partner not found')
      return await this.prisma.partners.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || InternalServerErrorException)
    }
  }
}
