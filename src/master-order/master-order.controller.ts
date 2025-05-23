import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MasterOrderService } from './master-order.service';
import { CreateMasterOrderDto } from './dto/create-master-order.dto';
import { UpdateMasterOrderDto } from './dto/update-master-order.dto';

@Controller('master-order')
export class MasterOrderController {
  constructor(private readonly masterOrderService: MasterOrderService) {}

  @Post()
  create(@Body() createMasterOrderDto: CreateMasterOrderDto) {
    return this.masterOrderService.create(createMasterOrderDto);
  }

  @Get()
  findAll() {
    return this.masterOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterOrderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterOrderDto: UpdateMasterOrderDto) {
    return this.masterOrderService.update(id, updateMasterOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterOrderService.remove(id);
  }
}
