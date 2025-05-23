import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({ example: 'nike' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'nike' })
    @IsOptional()
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'nike' })
    @IsOptional()
    @IsString()
    name_en?: string
}
