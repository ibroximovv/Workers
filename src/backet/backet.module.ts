import { Module } from '@nestjs/common';
import { BacketService } from './backet.service';
import { BacketController } from './backet.controller';

@Module({
  controllers: [BacketController],
  providers: [BacketService],
})
export class BacketModule {}
