import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsPhoneNumber, IsString } from "class-validator";

export class CreateMasterDto {
    @ApiProperty({ example: 'kimdir' })
    @IsString()
    fullName: string

    @ApiProperty({ example: '+998999999999' })
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean

    @ApiProperty({ example: 1990 })
    @Type(() => Number)
    @IsInt()
    year: number

    @ApiProperty({ example: 'image.png' })
    @IsString()
    image: string

    @ApiProperty({ example: 'passportImage.png' })
    @IsString()
    passportImage: string

    @ApiProperty({ example: 'aslkjn sdafkknsda fasdflkansdf adsfsadflkn' })
    @IsString()
    about: string

    @ApiProperty({ example: [
        {
            productId: '7db7cbaa-0145-4acb-ba3e-1acaeaed1c76',
            levelId: '336b2738-a7b2-4696-964f-a37bbba347b4',
            minWorkingHours: 1,
            priceHourly: 10000,
            priceDaily: 100000,
            experience: 2
        }
    ]})
    @IsArray()
    products: {
        productId: string,
        levelId: string,
        minWorkingHours: number,
        priceHourly: number,
        priceDaily: number,
        experience: number
    }[]
}
