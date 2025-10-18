import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
	@ApiProperty({ description: 'JWT access token' })
	accessToken: string;

	@ApiProperty({
		description: 'Refresh token used for a new access token after expiry',
	})
	refreshToken?: string;
}
