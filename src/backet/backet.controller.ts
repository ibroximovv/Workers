import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BacketService } from './backet.service';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';
import { CurrentUser } from 'src/common/current-user.decorator';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@UseGuards(AuthorizationGuard)
@Controller('backet')
export class BacketController {
  constructor(private readonly backetService: BacketService) {}

  @Post()
  create(@Body() createBacketDto: CreateBacketDto, @CurrentUser() user: any) {
    return this.backetService.create(createBacketDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.backetService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBacketDto: UpdateBacketDto) {
    return this.backetService.update(id, updateBacketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backetService.remove(id);
  }
}
