import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateShowcaseDto {
    @ApiProperty({ example: 'nike' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'nike' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'nike' })
    @IsOptional()
    @IsString()
    name_en?: string

    @ApiProperty({ example: 'description_uz' })
    @IsString()
    description_uz: string

    @ApiProperty({ example: 'description_uz' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    description_ru?: string

    @ApiProperty({ example: 'description_uz' })
    @IsOptional()
    @IsString()
    description_en?: string

    @ApiProperty({ example: 'image.png' })
    @IsString()
    image: string

    @ApiProperty({ example: 'link' })
    @IsString()
    link: string
}
