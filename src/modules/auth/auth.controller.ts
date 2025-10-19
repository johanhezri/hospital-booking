import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RegisterDoctorDto } from './dto/register-doctor.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
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
	async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
		const user = await this.authService.validateUser(body);
		const res = await this.authService.generateTokens(user);
		return res;
	}

	@Public()
	@Post('refresh')
	async refresh(@Body() body: { refreshToken: string }) {
		const res = await this.authService.refreshTokens(body.refreshToken);
		// console.log('res:', res);
		return res;
	}

	@Public()
	@Post('register/patient')
	async registerPatient(@Body() dto: RegisterPatientDto) {
		const user = await this.authService.registerPatient(dto);
		if (!user) throw new BadRequestException('Registration failed');
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		};
	}

	@UseGuards(AuthGuard('jwt'))
	@Roles('admin', 'staff')
	@Post('register/doctor')
	async registerDoctor(@Body() dto: RegisterDoctorDto) {
		const user = await this.authService.registerDoctor(dto);
		if (!user) throw new BadRequestException('Registration failed');
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			hospital: user.hospital,
		};
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('logout')
	async logout(@Req() req) {
		const userId = req.user.userId;
		return this.authService.logout(userId);
	}
}
