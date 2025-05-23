import { Module } from '@nestjs/common';
import { GenerealInfoService } from './genereal-info.service';
import { GenerealInfoController } from './genereal-info.controller';

@Module({
  controllers: [GenerealInfoController],
  providers: [GenerealInfoService],
})
export class GenerealInfoModule {}
