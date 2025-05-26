import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { GenerealInfoService } from './genereal-info.service';
import { CreateGenerealInfoDto } from './dto/create-genereal-info.dto';
import { UpdateGenerealInfoDto } from './dto/update-genereal-info.dto';
import { GetGeneralInfoDto } from './dto/get-general-info.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { SessionGuard } from 'src/session/session.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('genereal-info')
export class GenerealInfoController {
  constructor(private readonly generealInfoService: GenerealInfoService) {}

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createGenerealInfoDto: CreateGenerealInfoDto) {
    return this.generealInfoService.create(createGenerealInfoDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get()
  findAll(@Query() query: GetGeneralInfoDto) {
    return this.generealInfoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generealInfoService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenerealInfoDto: UpdateGenerealInfoDto) {
    return this.generealInfoService.update(id, updateGenerealInfoDto);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generealInfoService.remove(id);
  }
}
