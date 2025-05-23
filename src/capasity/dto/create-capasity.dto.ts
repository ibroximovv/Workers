import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCapasityDto {
    @ApiProperty({ example: '15l' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: '15л' })
    @IsString()
    name_ru: string

    @ApiProperty({ example: '15l' })
    @IsString()
    name_en: string
}
