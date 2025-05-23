import { Module } from '@nestjs/common';
import { RegoinService } from './regoin.service';
import { RegoinController } from './regoin.controller';

@Module({
  controllers: [RegoinController],
  providers: [RegoinService],
})
export class RegoinModule {}
