import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RegoinService } from './regoin.service';
import { CreateRegoinDto } from './dto/create-regoin.dto';
import { UpdateRegoinDto } from './dto/update-regoin.dto';
import { GetRegionDto } from './dto/get-region.dto';

@Controller('region')
export class RegoinController {
  constructor(private readonly regoinService: RegoinService) {}

  @Post()
  create(@Body() createRegoinDto: CreateRegoinDto) {
    return this.regoinService.create(createRegoinDto);
  }

  @Get()
  findAll(@Query() query: GetRegionDto) {
    return this.regoinService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regoinService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegoinDto: UpdateRegoinDto) {
    return this.regoinService.update(id, updateRegoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regoinService.remove(id);
  }
}
