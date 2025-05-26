import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID, Matches } from "class-validator";
import { UUID } from "crypto";

export class CreateProductDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'аыв' })
    @IsOptional()
    @Matches(/^[\u0400-\u04FF0-9\s]+$/)
    @IsString()
    name_ru?: string

    @ApiProperty({ example: 'name' })
    @IsOptional()
    @IsString()
    name_en?: string

    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean

    @ApiProperty({ example: 'image.png' })
    @IsString()
    image: string

    @ApiProperty({ example: 2 })
    @IsInt()
    minWorkingHours: number

    @ApiProperty({
        example: [
            { levelId: 'd223f2c9-4f3e-4443-8016-f3f397d13a55', priceHourly: 10000, priceDaily: 80000, minWorkingHours: 2 }
        ]
    })
    @IsArray()
    levels: {
        levelId: UUID;
        priceHourly: number;
        priceDaily: number;
        minWorkingHours: number;
    }[];

    @ApiProperty({ type: [String], example: ["9b8c8064-7db6-47c0-8bf7-7ffedeac4153", "70916968-8219-4d48-b203-844c9f1ee13f"] })
    @IsArray()
    @IsUUID("all", { each: true })
    tools: string[];
}
