import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateProductDto {
    @ApiProperty({ example: 'name' })
    @IsString()
    name_uz: string

    @ApiProperty({ example: 'name' })
    @IsOptional()
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
            { levelId: '336b2738-a7b2-4696-964f-a37bbba347b4', priceHourly: 10000, priceDaily: 80000, minWorkingHours: 2 }
        ]
    })
    @IsArray()
    levels: {
        levelId: UUID;
        priceHourly: number;
        priceDaily: number;
        minWorkingHours: number;
    }[];

    @ApiProperty({ type: [String], example: ["32873e32-28ad-4a64-9944-418b37e07306", "32873e32-28ad-4a64-9944-418b37e07306"] })
    @IsArray()
    @IsUUID("all", { each: true })
    tools: string[];
}
