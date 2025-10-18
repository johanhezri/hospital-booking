import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class RegisterDoctorDto {
  @ApiProperty({ example: 'doctor@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Dr. Strange' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1d3cd65e-7a7a-4b76-9589-d29a17431e3a',
    description: 'Hospital id of the doctor',
  })
  @IsNumber()
  @IsNotEmpty()
  hospitalId: number;

  @ApiProperty({ example: 'Cardiology' })
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsInt()
  @Min(10)
  slotDurationMinutes?: number;
}
