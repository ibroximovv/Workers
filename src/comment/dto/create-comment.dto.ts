import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { UUID } from "crypto";

class MasterStarDto {
  @ApiProperty({ example: '776fa1d8-91b9-42f9-a717-4503d257a9db' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  star: number;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'good' })
  @IsString()
  message: string;

  @ApiProperty({
    example: [
      {
        id: '776fa1d8-91b9-42f9-a717-4503d257a9db',
        star: 5
      },
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MasterStarDto)
  masters: MasterStarDto[];

  @ApiProperty({ example: 'eb7545b4-ba17-4b84-8375-edd26a2575f9' })
  @IsUUID()
  orderId: UUID;
}
