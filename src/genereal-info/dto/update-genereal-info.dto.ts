import { PartialType } from '@nestjs/swagger';
import { CreateGenerealInfoDto } from './create-genereal-info.dto';

export class UpdateGenerealInfoDto extends PartialType(CreateGenerealInfoDto) {}
