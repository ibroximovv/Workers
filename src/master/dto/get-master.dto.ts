import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetMasterDto {
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

    @ApiProperty({ required: false, description: 'fullName, phone' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'fullName', 'year', 'phone'] })
    @IsOptional()
    @IsIn(['id', 'fullName', 'year', 'phone'])
    sortBy?: 'id' | 'fullName' | 'year' | 'phone'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    productId?: UUID

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    levelId?: UUID

    @ApiProperty({ required: false, type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;
}