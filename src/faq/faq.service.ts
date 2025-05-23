import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService){}
  async create(createFaqDto: CreateFaqDto) {
    try {
      const findone = await this.prisma.faq.findFirst({ where: {
        OR: [
          { question: createFaqDto.question },
          { answer: createFaqDto.answer }
        ]
      }})
      if (findone) throw new BadRequestException('faq already exists')
      return await this.prisma.faq.create({ data: createFaqDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.faq.findMany();
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.faq.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('faq not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    try {
      const findone = await this.prisma.faq.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('faq not found')
      return await this.prisma.faq.update({ where: { id }, data: updateFaqDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.faq.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('faq not found')
      return await this.prisma.faq.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
