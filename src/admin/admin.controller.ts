import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { SessionGuard } from 'src/session/session.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.adminService.create(createUserDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @CacheKey('admin-cache')
  @RolesDecorator(UserRole.ADMIN, UserRole.VIEWER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Get()
  findAll(@Query() query: GetUserDto) {
    return this.adminService.findAll(query);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.VIEWER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(id, updateUserDto);
  }

  @RolesDecorator(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
