import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { CapasityService } from './capasity.service';
import { CreateCapasityDto } from './dto/create-capasity.dto';
import { UpdateCapasityDto } from './dto/update-capasity.dto';
import { GetCapasityDto } from './dto/get-capasity.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { SessionGuard } from 'src/session/session.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('capasity')
export class CapasityController {
  constructor(private readonly capasityService: CapasityService) {}

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createCapasityDto: CreateCapasityDto) {
    return this.capasityService.create(createCapasityDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get()
  findAll(@Query() query: GetCapasityDto) {
    return this.capasityService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capasityService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCapasityDto: UpdateCapasityDto) {
    return this.capasityService.update(id, updateCapasityDto);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capasityService.remove(id);
  }
}
