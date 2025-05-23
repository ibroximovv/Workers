import { PartialType } from '@nestjs/swagger';
import { CreateMasterOrderDto } from './create-master-order.dto';

export class UpdateMasterOrderDto extends PartialType(CreateMasterOrderDto) {}
