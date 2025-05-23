import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateGenerealInfoDto {
    @ApiProperty({ example: 'example@gmail.com' })
    @IsOptional()
    @IsEmail()
    email?: string

    @ApiProperty({ example: "link" })
    @IsOptional()
    @IsString()
    links?: string

    @ApiProperty({ example: '+998911111111' })
    @IsOptional()
    @IsPhoneNumber()
    phones?: string

    @ApiProperty({ example: 'telegramId' })
    @IsOptional()
    @IsString()
    telegramId?: string
}
