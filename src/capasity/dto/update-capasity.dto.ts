import { PartialType } from '@nestjs/swagger';
import { CreateCapasityDto } from './create-capasity.dto';

export class UpdateCapasityDto extends PartialType(CreateCapasityDto) {}
