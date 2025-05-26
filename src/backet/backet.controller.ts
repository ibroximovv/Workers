import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { BacketService } from './backet.service';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';
import { CurrentUser } from 'src/common/current-user.decorator';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { GetBacketDto } from './dto/get-backet.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SessionGuard } from 'src/session/session.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(AuthorizationGuard)
@Controller('backet')
export class BacketController {
  constructor(private readonly backetService: BacketService) {}

  @Post()
  create(@Body() createBacketDto: CreateBacketDto, @CurrentUser() user: any) {
    return this.backetService.create(createBacketDto, user);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @CacheKey('backet-cache')
  @Get()
  findAll(@CurrentUser() user: any, @Query() query: GetBacketDto) {
    return this.backetService.findAll(user, query);
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
