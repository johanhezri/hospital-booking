import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalDto {
	@ApiProperty({ example: 'Gleneagles Hospital' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiPropertyOptional({
		example: 'Kuala Lumpur',
		description: 'Address / City of the hospital',
	})
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty({
		example: 'Asia/Kuala_Lumpur',
		description: 'Timezone identifier for the hospital (IANA format)',
	})
	@IsString()
	@IsNotEmpty()
	timezone: string;

	@ApiPropertyOptional({
		example: 'smtp.gmail.com',
		description: 'SMTP host for outgoing emails (optional)',
	})
	@IsString()
	@IsOptional()
	smtp_host?: string;

	@ApiPropertyOptional({
		example: 'hospital@gmail.com',
		description: 'SMTP username (optional)',
	})
	@IsString()
	@IsOptional()
	smtp_user?: string;

	@ApiPropertyOptional({
		example: 'secure-password',
		description: 'SMTP password (optional)',
	})
	@IsString()
	@IsOptional()
	smtp_pass?: string;
}
