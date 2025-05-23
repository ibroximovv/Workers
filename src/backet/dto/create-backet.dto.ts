import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsObject, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateBacketDto {
    @ApiProperty({ 
        example: {
            productId: '52b4d99d-45f3-48c8-a53d-bf0f375f057a',
            levelId: '135c5bda-4309-4713-8494-113a923814f0'
        },
        required: false
    })
    @IsOptional()
    @IsObject()
    product?: {
        productId: UUID,
        levelId: UUID
    };

    @ApiProperty({ example: '32873e32-28ad-4a64-9944-418b37e07306', required: false })
    @IsOptional()
    @IsUUID()
    toolId?: string;

    @ApiProperty({ example: 2 })
    @Type(() => Number)
    @IsInt()
    quantity: number;
}
