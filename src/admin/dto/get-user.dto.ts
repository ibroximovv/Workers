import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class GetUserDto {
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

    @ApiProperty({ required: false, description: 'fullName, phone, email' })
    @IsOptional()
    @IsString()
    search?: string

    @ApiProperty({ required: false, enum: ['id', 'fullName', 'phone', 'email'] })
    @IsOptional()
    @IsIn(['id', 'fullName', 'phone', 'email'])
    sortBy?: 'id' | 'fullName' | 'phone' | 'email'

    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc'

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    regionId?: UUID

    @ApiProperty({ required: false, enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}