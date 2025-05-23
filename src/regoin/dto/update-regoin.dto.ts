
import { PartialType } from '@nestjs/swagger';
import { CreateRegoinDto } from './create-regoin.dto';

export class UpdateRegoinDto extends PartialType(CreateRegoinDto) {}
