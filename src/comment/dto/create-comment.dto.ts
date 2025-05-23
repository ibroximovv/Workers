import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateCommentDto {
    @ApiProperty({ example: 'good' })
    @IsString()
    message: string

    @ApiProperty({ example: [
        {
            id: 'string',
            star: 5
        },
        {
            id: 'string',
            star: 4
        }
    ]})
    masters: {
        id: UUID,
        star: number
    }[]

    @ApiProperty({ example: 'string' })
    @IsUUID()
    orderId: UUID
}
