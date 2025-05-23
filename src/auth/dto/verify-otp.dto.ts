import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: '+998999999999' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: '123456' })
    @IsString()
    otp: string
}