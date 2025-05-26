import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateRegoinDto {
    @ApiProperty({ example: 'mashey' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'ывавыаы' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'sadasdad' })
    @IsOptional()
    @IsString()
    name_en?: string
}
