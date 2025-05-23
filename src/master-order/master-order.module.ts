import { Module } from '@nestjs/common';
import { MasterOrderService } from './master-order.service';
import { MasterOrderController } from './master-order.controller';

@Module({
  controllers: [MasterOrderController],
  providers: [MasterOrderService],
})
export class MasterOrderModule {}
