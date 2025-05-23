import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateMasterOrderDto {
    @ApiProperty({ type: [String], example: ["ff2e44d6-37b9-4288-a1e2-0adc127d4f54", "string"] })
    @IsArray()
    @IsUUID("all", { each: true })
    masterId: string[];

    @ApiProperty({ example: '646f1433-b5db-4cb3-88ac-272f3e1bb763'})
    @IsUUID()
    orderId: UUID
}
