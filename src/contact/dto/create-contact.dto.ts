import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString } from "class-validator";

export class CreateContactDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name: string

    @ApiProperty({ example: 'surName' })
    @IsString()
    surName: string

    @ApiProperty({ example: '+998999999999' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: 'adsress' })
    @IsString()
    address: string

    @ApiProperty({ example: 'message' })
    @IsString()
    message: string
}
