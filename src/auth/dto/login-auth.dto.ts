import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginAuthDto {
    @ApiProperty({ example: 'admin' })
    @IsString()
    fullname: string

    @ApiProperty({ example: 'admin' })
    @IsString()
    password: string
}