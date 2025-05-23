import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService){}
  async create(createCommentDto: CreateCommentDto, user: any) {
    const { message, orderId, masters } = createCommentDto;
    try {
      const findorder = await this.prisma.order.findFirst({ where: { id: orderId }})
      if (!findorder) throw new BadRequestException('Order not found')
      if (findorder.status !== 'FINISHED') throw new BadRequestException('order is not finished')
      const existingComment = await this.prisma.comment.findFirst({
        where: {
          orderId,
          userId: user.id,
        },
      });
  
      if (existingComment) {
        throw new BadRequestException('Siz bu orderga izoh yozgansiz');
      }
  
      await this.prisma.comment.create({
        data: {
          message,
          orderId,
          userId: user.id,
        },
      });
  
      for (const m of masters) {
        const findone = await this.prisma.masterOrder.findFirst({ where: { masterId: m.id }})
        if (!findone) throw new BadRequestException('order in this master not found')
        const alreadyRated = await this.prisma.star.findFirst({
          where: {
            masterId: m.id,
            userId: user.id,
          },
        });
  
        if (alreadyRated) {
          continue;
        }
  
        await this.prisma.star.create({
          data: {
            masterId: m.id,
            userId: user.id,
            star: m.star,
          },
        });
      }
  
      return { message: 'Comment va stars successfully added' };
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'INternal server error');
    }
  }
  
  async findAll(user: any) {
    try {
      return await this.prisma.comment.findMany({ where: { userId: user.id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.comment.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Comment not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const findone = await this.prisma.comment.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Comment not found')
      return await this.prisma.comment.update({ where: { id }, data: updateCommentDto });
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.comment.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Comment not found')
      return await this.prisma.comment.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
