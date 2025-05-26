import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateUserDto {
    @ApiProperty({ example: 'fullname' })
    @IsString()
    fullname: string

    @ApiProperty({ example: 'parol' })
    @IsString()
    password: string

    @ApiProperty({ example: '+998999999999' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: 'nimadir@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'c126c21d-800f-46a0-ba95-d7069417e52f' })
    @IsUUID()
    regionId: UUID

    @ApiProperty({ enum: UserRole, example: 'ADMIN' })
    @IsEnum(UserRole)
    role: UserRole

    @ApiProperty({ example: 'asdas' })
    @IsOptional()
    @IsString()
    inn?: string

    @ApiProperty({ example: 'asdas' })
    @IsOptional()
    @IsString()
    mfo?: string

    @ApiProperty({ example: 'sadasd' })
    @IsOptional()
    @IsString()
    bank?: string

    @ApiProperty({ example: 'sadsfasdf' })
    @IsOptional()
    @IsString()
    oked?: string

    @ApiProperty({ example: 'sadsfasdf' })
    @IsOptional()
    @IsString()
    rc?: string

    @ApiProperty({ example: 'sadsfassdanfdslfkjdf' })
    @IsOptional()
    @IsString()
    address?: string
}