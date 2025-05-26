import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { MasterOrderService } from './master-order.service';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';
import { UpdateMasterOrderDto } from './dto/update-master-order.dto';
import { GetMasterOrderDto } from './dto/get-master-order.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { SessionGuard } from 'src/session/session.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('master-order')
export class MasterOrderController {
  constructor(private readonly masterOrderService: MasterOrderService) {}

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createMasterOrderDto: CreateMasterOrderDto) {
    return this.masterOrderService.create(createMasterOrderDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get()
  findAll(@Query() query: GetMasterOrderDto) {
    return this.masterOrderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterOrderService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterOrderDto: UpdateMasterOrderDto) {
    return this.masterOrderService.update(id, updateMasterOrderDto);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterOrderService.remove(id);
  }
}
