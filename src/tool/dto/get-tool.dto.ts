import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetToolDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    skip?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    @IsInt()
    take?: number

    @ApiProperty({ required: false, description: 'name_uz, name_ru, name_en, code' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'name_uz', 'name_ru', 'name_en', 'price', 'quantity'] })
    @IsOptional()
    @IsIn(['id', 'name_uz', 'name_ru', 'name_en', 'price', 'quantity'])
    sortBy?: 'id' | 'name_uz' | 'name_ru' | 'name_en' | 'price' | 'quantity'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'
    
    @ApiProperty({ required: false, type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    brandId?: UUID

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    capasityId?: UUID

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    sizeId?: UUID

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    priceFrom?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    priceTo?: number
}
