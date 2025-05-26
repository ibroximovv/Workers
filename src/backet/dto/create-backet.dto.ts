import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsObject, IsOptional, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateBacketDto {
    @ApiProperty({ 
        example: {
            productId: 'a6f8769a-11eb-4cf4-ad05-644cae78d01a',
            levelId: 'd223f2c9-4f3e-4443-8016-f3f397d13a55'
        },
        required: false
    })
    @IsOptional()
    @IsObject()
    product?: {
        productId: UUID,
        levelId: UUID
    };

    @ApiProperty({ example: '9b8c8064-7db6-47c0-8bf7-7ffedeac4153', required: false })
    @IsOptional()
    @IsUUID()
    toolId?: string;

    @ApiProperty({ example: 2 })
    @Type(() => Number)
    @IsInt()
    quantity: number;
}
