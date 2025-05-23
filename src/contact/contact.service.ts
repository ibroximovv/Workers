import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService){}
  async create(createContactDto: CreateContactDto) {
    try {
      const findone = await this.prisma.contact.findFirst({ where: {
        AND: [
          { name: createContactDto.name },
          { surName: createContactDto.surName },
          { phone: createContactDto.phone },
          { message: createContactDto.message }
        ]
      }})
      if (findone) throw new BadRequestException('you have been this message is already sent')
      return await this.prisma.contact.create({ data: createContactDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.contact.findMany()
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.contact.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Contact not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.contact.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Contact not found')
      return `This action removes a #${id} contact`;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
