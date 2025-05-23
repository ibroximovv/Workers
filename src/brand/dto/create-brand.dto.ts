import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({ example: 'nike' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'nike' })
    @Matches(/^[\u0400-\u04FF\s]+$/)
    @IsOptional()
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'nike' })
    @IsOptional()
    @IsString()
    name_en?: string
}
