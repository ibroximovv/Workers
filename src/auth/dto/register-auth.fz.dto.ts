import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class RegisterAuthFz {
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

    @ApiProperty({ example: '5b71d12f-add8-4713-96b5-28b0750ffdf5' })
    @IsUUID()
    regionId: UUID
}