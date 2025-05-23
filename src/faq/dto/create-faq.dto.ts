import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateFaqDto {
    @ApiProperty({ example: 'question' })
    @IsString()
    question: string

    @ApiProperty({ example: 'answer' })
    @IsString()
    answer: string
}
