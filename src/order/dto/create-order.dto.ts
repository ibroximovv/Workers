import { ApiProperty } from "@nestjs/swagger";
import { Measure, PaymentType } from "@prisma/client";
import { IsBoolean, IsCreditCard, IsDateString, IsEnum, IsObject, IsOptional, IsString, Length, Matches } from "class-validator";
import { UUID } from "crypto";

export class CreateOrderDto {
    @ApiProperty({ example: {
        lat: 'asdaskj',
        long: 'asdaksdnkjn'
    }})
    @IsObject()
    location: {
        lat: string,
        long: string
    }

    @ApiProperty({ example: 'qayerdir' })
    @IsString()
    address: string

    @ApiProperty({ example: new Date() })
    @IsDateString()
    date: string

    @ApiProperty({ enum: PaymentType })
    @IsEnum(PaymentType)
    paymentType: PaymentType

    @ApiProperty({ example: true })
    @IsBoolean()
    withDelivery: boolean

    @ApiProperty({ example: 'asdajsndkjasnd asdkankdjn'})
    @IsOptional()
    @IsString()
    commentToDelivery?: string

    @ApiProperty({ example: '4242424242424242' })
    @IsOptional()
    @Length(16, 16)
    @Matches(/^\d+$/)
    @IsCreditCard()
    @IsString()
    cardNumber?: string

    @ApiProperty({ example: '12/26'})
    @IsOptional()
    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    cardDate?: string;

    @ApiProperty({ example: [
        {
            productId: 'a6f8769a-11eb-4cf4-ad05-644cae78d01a',
            levelId: 'd223f2c9-4f3e-4443-8016-f3f397d13a55',
            count: 1,
            measure: 'HOUR',
            quantity: 2,
        }
    ]})
    @IsOptional()
    products?: {
        productId: UUID,
        levelId: UUID,
        count: number,
        measure: Measure,
        quantity: number,
    }[]

    @ApiProperty({ example: [
        { 
            toolId: '9b8c8064-7db6-47c0-8bf7-7ffedeac4153',
            count: 2
        }
    ]})
    @IsOptional()
    tools?: {
        toolId: UUID,
        count: number
    }[]
}
