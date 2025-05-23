import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class CreateSizeDto {
    @ApiProperty({ example: '100sm' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: '100cm' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF\s]+$/)
    @IsString()
    name_ru?: string

    @ApiProperty({ example: '100sm' })
    @IsOptional()
    @IsString()
    name_en?: string
}
