import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService){}
  async create(createToolDto: CreateToolDto) {
    try {
      const findone = await this.prisma.tool.findFirst({
        where: {
          AND: [
            { name_uz: createToolDto.name_uz },
            { name_ru: createToolDto.name_ru },
            { name_en: createToolDto.name_en },
            { price: createToolDto.price },
            { sizeId: createToolDto.sizeId },
            { description_uz: createToolDto.description_uz }
          ]
        }
      })
      if (findone) throw new BadRequestException('Tool already exists')
        const tools = await this.prisma.tool.findMany();

      const lastCodeNumber = tools.length
        ? Math.max(...tools.map(t => parseInt(t.code)))
        : 0;
      
      const newCode = String(lastCodeNumber + 1).padStart(6, '0');
      return await this.prisma.tool.create({
        data: {
          ...createToolDto,
          code: newCode
        }
      });
    } catch (error) {
      if (error.code === 'P2003') throw new BadRequestException(`relation data is not found`)
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findAll() {
    try {
      return await this.prisma.tool.findMany();
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.tool.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Tool not found')
      return findone;
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateToolDto: UpdateToolDto) {
    try {
      const findone = await this.prisma.tool.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Tool not found')
      const findOne = await this.prisma.tool.findFirst({
        where: {
          AND: [
            { name_uz: updateToolDto.name_uz },
            { name_ru: updateToolDto.name_ru },
            { name_en: updateToolDto.name_en },
            { price: updateToolDto.price },
            { sizeId: updateToolDto.sizeId },
            { description_uz: updateToolDto.description_uz }
          ]
        } 
      })
      if (findOne) throw new BadRequestException('Tool already exists')
      return await this.prisma.tool.update({ where: { id }, data: updateToolDto });
    } catch (error) {
      if (error.code === 'P2003') throw new BadRequestException('relation data is not found')
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.tool.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Tool not found')
      return await this.prisma.tool.delete({ where: { id }});
    } catch (error) {
      if(error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
