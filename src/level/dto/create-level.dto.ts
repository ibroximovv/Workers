import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateLevelDto {
    @ApiProperty({ example: 'nike' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'nike' })
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsOptional()
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'nike' })
    @IsOptional()
    @IsString()
    name_en?: string
}
