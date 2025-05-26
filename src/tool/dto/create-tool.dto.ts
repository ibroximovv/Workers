import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { UUID } from "crypto";

export class CreateToolDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'ыдфлифы' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'name' })
    @IsOptional()
    @IsString()
    name_en?: string

    @ApiProperty({ example: 'description_uz' })
    @IsString()
    description_uz: string

    @ApiProperty({ example: 'рыдывлгфп' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    description_ru?: string

    @ApiProperty({ example: 'description_uz' })
    @IsOptional()
    @IsString()
    description_en?: string

    @ApiProperty({ example: 10000 })
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
    
    @ApiProperty({ example: 'c3011b2c-32bd-4e8d-9b86-9d5c2b7fd021'})
    @IsUUID()
    brandId: UUID

    @ApiProperty({ example: '1d2ec1aa-3326-45a2-86b6-c35381aeea86'})
    @IsOptional()
    @IsUUID()
    capasityId?: UUID
    
    @ApiProperty({ example: 'b674826c-bf24-4c89-abdf-23f4312a92ec'})
    @IsOptional()
    @IsUUID()
    sizeId?: UUID
}
