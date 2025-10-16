import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

class LoginResponseDto {
	// TODO create dto file
	access_token: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@ApiOperation({
		summary: 'User login',
		description: 'Authenticate user and return JWT token.',
	})
	@ApiResponse({
		status: 200,
		description: 'Login successful',
		type: LoginResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	async login(@Body() body: LoginDto) {
		const user = await this.authService.validateUser(body);

		return this.authService.login(user); // TODO use refreshToken
		// return this.authService.generateTokens(user);
	}

	@Post('register')
	async register(@Body() dto: any) {
		const user = await this.authService.register(dto);
		if (!user) throw new BadRequestException('Registration failed');
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		};
	}

	@Post('refresh')
	async refresh(@Body() body: { refreshToken: string }) {
		return this.authService.refreshTokens(body.refreshToken);
	}
}
