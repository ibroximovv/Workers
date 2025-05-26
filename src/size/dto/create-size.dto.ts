import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateSizeDto {
    @ApiProperty({ example: '2m' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: '2м' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    name_ru?: string

    @ApiProperty({ example: '2m' })
    @IsOptional()
    @IsString()
    name_en?: string
}
