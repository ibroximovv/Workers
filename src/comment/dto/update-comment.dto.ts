import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
    @ApiProperty({ example: 'good' })
    @IsOptional()
    @IsString()
    message?: string
}
