import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateHospitalDto {
  @ApiProperty({ example: 'Gleneagles Hospital' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Kuala Lumpur' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
