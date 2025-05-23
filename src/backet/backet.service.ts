import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BacketService {
  constructor(private readonly prisma: PrismaService){}
  async create(createBacketDto: CreateBacketDto, user: any) {
    try {
      const { product, toolId, quantity } = createBacketDto;
  
      const isProductValid = product?.productId && product?.levelId;
      const isToolValid = !!toolId;
  
      if (!isProductValid && !isToolValid) {
        throw new BadRequestException('Either product+level or toolId must be provided');
      }
      if (isProductValid && isToolValid) {
        throw new BadRequestException('Only one of product+level or toolId should be provided');
      }

      const [foundProduct, foundLevel, foundTool] = await Promise.all([
        isProductValid
          ? this.prisma.product.findFirst({ where: { id: product.productId } })
          : Promise.resolve(null),
        isProductValid
          ? this.prisma.level.findFirst({ where: { id: product.levelId } })
          : Promise.resolve(null),
        isToolValid
          ? this.prisma.tool.findFirst({ where: { id: toolId } })
          : Promise.resolve(null)
      ]);
  
      if (isProductValid && (!foundProduct || !foundLevel)) {
        throw new BadRequestException('Product or level not found');
      }
      if (isToolValid && !foundTool) {
        throw new BadRequestException('Tool not found');
      }

      const existing = await this.prisma.backetItem.findFirst({
        where: {
          productId: isProductValid ? product.productId : null,
          levelId: isProductValid ? product.levelId : null,
          toolId: isToolValid ? toolId : null,
          userId: user.id,
        }
      });
  
      if (existing) {
        throw new BadRequestException('Backet item already exists');
      }

      let total = 0;
      if (isProductValid) {
        const productLevel = await this.prisma.productLevel.findFirst({
          where: {
            productId: product.productId,
            levelId: product.levelId
          }
        });
  
        if (!productLevel) {
          throw new BadRequestException('ProductLevel relation not found');
        }
  
        total = productLevel.priceDaily * quantity;
  
      } else if (isToolValid && foundTool) {
        if (quantity > foundTool.quantity) {
          throw new BadRequestException(`Maximum quantity: ${foundTool.quantity}`);
        }
        total = foundTool.price * quantity;
      }

      const data: any = {
        userId: user.id,
        quantity,
        total,
      };
  
      if (isProductValid) {
        data.productId = product.productId;
        data.levelId = product.levelId;
      }
      if (isToolValid) {
        data.toolId = toolId;
      }

      return await this.prisma.backetItem.create({ data });
  
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error');
    }
  }
  
  

  async findAll(user: any) {
    try {
      return await this.prisma.backetItem.findMany({ where: { userId: user.id}});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async findOne(id: string) {
    try {
      const findone = await this.prisma.backetItem.findFirst({ where: { id } })
      if (!findone) throw new BadRequestException('Backet not found')
      return findone;
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async update(id: string, updateBacketDto: UpdateBacketDto) {
    try {
      const findone = await this.prisma.backetItem.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Backet not found')
      
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async remove(id: string) {
    try {
      const findone = await this.prisma.backetItem.findFirst({ where: { id }})
      if (!findone) throw new BadRequestException('Backet not found')
      return await this.prisma.backetItem.delete({ where: { id }});
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
