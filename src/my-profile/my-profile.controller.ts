import { Body, Controller, Delete, Get, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { MyProfileService } from './my-profile.service';
import { CurrentUser } from 'src/common/current-user.decorator';
import { UpdateMyProfileDto } from './dto/update-my-profile';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SessionGuard } from 'src/session/session.guard';

@UseGuards(SessionGuard)
@UseGuards(AuthorizationGuard)
@Controller('my-profile')
export class MyProfileController {
  constructor(private readonly myProfileService: MyProfileService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get('get-my-profile')
  getMyProfile(@CurrentUser() user: any) {
    return this.myProfileService.getMyProfile(user);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get('get-my-orders')
  getMyOrders(@CurrentUser() user: any) {
    return this.myProfileService.getMyOrders(user);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  @Get('get-my-backet')
  getMyBacket(@CurrentUser() user: any) {
    return this.myProfileService.getMyBacket(user);
  }

  @Patch('update-my-profile')
  updateMyProfile(@CurrentUser() user: any, @Body() data: UpdateMyProfileDto) {
    return this.myProfileService.updateMyProfile(user, data)
  }

  @Delete('delete-my-profile')
  deleteMyProfile(@CurrentUser() user: any) {
    return this.myProfileService.deleteMyProfile(user)
  }
}
