import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, PaymentType } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetBacketDto {
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

    @ApiProperty({ required: false, enum: ['id', 'quantity', 'total'] })
    @IsOptional()
    @IsIn(['id', 'quantity', 'total'])
    sortBy?: 'id' | 'quantity' | 'total' 

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

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    toolId?: UUID
}
