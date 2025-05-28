import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class RegisterAuthYr {
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

    @ApiProperty({ example: 'asdas' })
    @IsString()
    inn: string

    @ApiProperty({ example: 'asdas' })
    @IsString()
    mfo: string

    @ApiProperty({ example: 'sadasd' })
    @IsString()
    bank: string

    @ApiProperty({ example: 'sadsfasdf' })
    @IsString()
    oked: string

    @ApiProperty({ example: 'sadsfasdf' })
    @IsString()
    rc: string

    @ApiProperty({ example: 'sadsfassdanfdslfkjdf' })
    @IsString()
    address: string
}