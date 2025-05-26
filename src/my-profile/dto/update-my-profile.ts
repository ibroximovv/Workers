import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateMyProfileDto {
    @ApiProperty({ example: 'fio' })
    @IsString()
    @IsOptional()
    fullname?: string

    @ApiProperty({ example: '+998900000000' })
    @IsOptional()
    @IsPhoneNumber()
    phone?: string

    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty({ example: 'qayerdir' })
    @IsString()
    @IsOptional()
    address?: string

    @ApiProperty({ example: 'parol' })
    @IsString()
    @IsOptional()
    password?: string
}