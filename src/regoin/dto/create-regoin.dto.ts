import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateRegoinDto {
    @ApiProperty({ example: 'mashey' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'ывавыаы' })
    @IsOptional()
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'sadasdad' })
    @IsOptional()
    @IsString()
    name_en?: string
}
