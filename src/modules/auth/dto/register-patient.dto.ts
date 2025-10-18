import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterPatientDto {
	@ApiProperty({ example: 'patient@gmail.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123' })
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@ApiProperty({ example: 'John Doe' })
	@IsNotEmpty()
	name: string;
}
