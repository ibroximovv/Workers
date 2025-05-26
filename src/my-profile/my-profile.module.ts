import { Module } from '@nestjs/common';
import { MyProfileService } from './my-profile.service';
import { MyProfileController } from './my-profile.controller';

@Module({
  controllers: [MyProfileController],
  providers: [MyProfileService],
})
export class MyProfileModule {}
