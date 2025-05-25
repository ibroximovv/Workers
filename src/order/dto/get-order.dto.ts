import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, PaymentType } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetOrderDto {
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

    @ApiProperty({ required: false, description: 'commentToDelivery, address' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'cardNumber', 'date'] })
    @IsOptional()
    @IsIn(['id', 'cardNumber', 'date'])
    sortBy?: 'id' | 'cardNumber' | 'date'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'
    
    @ApiProperty({ required: false, type: Boolean })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    withDelivery?: boolean;

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

    @ApiProperty({ required: false, enum: PaymentType })
    @IsOptional()
    @IsEnum(PaymentType)
    paymentType?: PaymentType

    @ApiProperty({ required: false, enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus
}
