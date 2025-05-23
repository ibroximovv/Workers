import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenerealInfoService } from './genereal-info.service';
import { CreateGenerealInfoDto } from './dto/create-genereal-info.dto';
import { UpdateGenerealInfoDto } from './dto/update-genereal-info.dto';

@Controller('genereal-info')
export class GenerealInfoController {
  constructor(private readonly generealInfoService: GenerealInfoService) {}

  @Post()
  create(@Body() createGenerealInfoDto: CreateGenerealInfoDto) {
    return this.generealInfoService.create(createGenerealInfoDto);
  }

  @Get()
  findAll() {
    return this.generealInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generealInfoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenerealInfoDto: UpdateGenerealInfoDto) {
    return this.generealInfoService.update(id, updateGenerealInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generealInfoService.remove(id);
  }
}
