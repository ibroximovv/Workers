import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CapasityService } from './capasity.service';
import { CreateCapasityDto } from './dto/create-capasity.dto';
import { UpdateCapasityDto } from './dto/update-capasity.dto';

@Controller('capasity')
export class CapasityController {
  constructor(private readonly capasityService: CapasityService) {}

  @Post()
  create(@Body() createCapasityDto: CreateCapasityDto) {
    return this.capasityService.create(createCapasityDto);
  }

  @Get()
  findAll() {
    return this.capasityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capasityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapasityDto: UpdateCapasityDto) {
    return this.capasityService.update(id, updateCapasityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capasityService.remove(id);
  }
}
