import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateDoctorDto {
  @ApiProperty({
    example: 3,
    description: `Doctor's id`,
  })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsInt()
  @Min(15)
  slotDurationMinutes?: number;
}
