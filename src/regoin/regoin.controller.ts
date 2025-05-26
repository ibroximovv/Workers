import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { RegoinService } from './regoin.service';
import { CreateRegoinDto } from './dto/create-regoin.dto';
import { UpdateRegoinDto } from './dto/update-regoin.dto';
import { GetRegionDto } from './dto/get-region.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { SessionGuard } from 'src/session/session.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('region')
export class RegoinController {
  constructor(private readonly regoinService: RegoinService) {}

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createRegoinDto: CreateRegoinDto) {
    return this.regoinService.create(createRegoinDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get()
  findAll(@Query() query: GetRegionDto) {
    return this.regoinService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regoinService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegoinDto: UpdateRegoinDto) {
    return this.regoinService.update(id, updateRegoinDto);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regoinService.remove(id);
  }
}
