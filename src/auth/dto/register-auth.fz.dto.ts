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

    @ApiProperty({ example: 'c126c21d-800f-46a0-ba95-d7069417e52f' })
    @IsUUID()
    regionId: UUID
}