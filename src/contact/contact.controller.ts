import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { GetContactDto } from './dto/get-contact.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RolesDecorator } from 'src/common/role.decorator';
import { UserRole } from '@prisma/client';
import { SessionGuard } from 'src/session/session.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get()
  findAll(@Query() query: GetContactDto) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(SessionGuard)
  @UseGuards(AuthorizationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
