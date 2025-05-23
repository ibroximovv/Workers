import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateSizeDto {
    @ApiProperty({ example: '100sm' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: '100cm' })
    @IsOptional()
    @IsString()
    name_ru?: string

    @ApiProperty({ example: '100sm' })
    @IsOptional()
    @IsString()
    name_en?: string
}
