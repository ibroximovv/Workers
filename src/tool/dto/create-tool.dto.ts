import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateToolDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'name' })
    @IsOptional()
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'name' })
    @IsOptional()
    @IsString()
    name_en?: string

    @ApiProperty({ example: 'description_uz' })
    @IsString()
    description_uz: string

    @ApiProperty({ example: 'description_uz' })
    @IsOptional()
    @IsString()
    description_ru?: string

    @ApiProperty({ example: 'description_uz' })
    @IsOptional()
    @IsString()
    description_en?: string

    @ApiProperty({ example: 213124 })
    @IsInt()
    @Type(() => Number)
    price: number

    @ApiProperty({ example: 12 })
    @IsInt()
    @Type(() => Number)
    quantity: number
    
    @ApiProperty({ example: 'image.png' })
    @IsString()
    image: string
    
    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean
    
    @ApiProperty({ example: 'd21098b4-b6d5-48fc-a8e3-9006e9be2d55'})
    @IsUUID()
    brandId: UUID

    @ApiProperty({ example: '17bf7259-a778-44be-8a4d-9e0942de7157'})
    @IsOptional()
    @IsUUID()
    capasityId?: UUID
    
    @ApiProperty({ example: 'bc3c3e71-1fc2-4b4d-a34b-e4ee7aa18054'})
    @IsOptional()
    @IsUUID()
    sizeId?: UUID
}
