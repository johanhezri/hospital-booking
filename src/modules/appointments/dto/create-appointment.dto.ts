import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Hospital ID', example: 1 })
  @IsNumber()
  hospitalId: number;

  @ApiProperty({ description: 'Doctor ID', example: 'uuid-of-doctor' })
  @IsUUID()
  doctorId: string;

  @ApiProperty({ description: 'Patient ID', example: 'uuid-of-patient' })
  @IsUUID()
  patientId: string;

  @ApiProperty({ description: 'Start time in ISO format', example: '2025-10-20T10:00:00Z' })
  @IsDateString()
  startsAt: string;

  @ApiProperty({ description: 'End time in ISO format', example: '2025-10-20T10:30:00Z' })
  @IsDateString()
  endsAt: string;
}
