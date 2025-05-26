import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class CreateCapasityDto {
    @ApiProperty({ example: '15l' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: '15л' })
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    name_ru: string

    @ApiProperty({ example: '15l' })
    @IsString()
    name_en: string
}
