import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { HospitalsService } from '../hospitals/hospitals.service';
import { DoctorsService } from '../doctors/doctors.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly hospitalsService: HospitalsService,
		private readonly doctorsService: DoctorsService,
		private jwtService: JwtService
	) {}

	async validateUser(body: LoginDto): Promise<any> {
		const { email, password } = body;
		const user = await this.usersService.findOneByEmail(email);
		if (!user) throw new UnauthorizedException('Invalid credentials');

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid)
			throw new UnauthorizedException('Invalid credentials');

		const { passwordHash, refreshTokenHash, ...result } = user;
		return result;
	}

	async generateTokens(user: any) {
		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role,
			hospitalId: user.hospital?.id || null,
		};

		const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

		// hash refreshToken before storing
		const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
		await this.usersService.update(user.id, { refreshTokenHash });
		return { accessToken, refreshToken };
	}

	async refreshTokens(refreshToken: string) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: process.env.JWT_SECRET,
			});

			const user = await this.usersService.findOne(payload.sub);
			if (!user || !user.refreshTokenHash) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			// verify hash
			const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
			if (!match) throw new UnauthorizedException('Invalid refresh token');

			return this.generateTokens(user);
		} catch {
			throw new UnauthorizedException('Refresh token expired or invalid');
		}
	}

	async registerPatient(dto: RegisterPatientDto) {
		const existing = await this.usersService.findByEmail(dto.email);
		if (existing) throw new ConflictException('Email already registered');

		const passwordHash = await bcrypt.hash(dto.password, 10);

		return this.usersService.create({
			name: dto.name,
			email: dto.email,
			passwordHash,
			role: 'patient',
		});
	}

	async registerDoctor(dto: RegisterDoctorDto) {
		const existing = await this.usersService.findByEmail(dto.email);
		if (existing) throw new ConflictException('Email already registered');

		const hospital = await this.hospitalsService.findActiveById(dto.hospitalId);
		if (!hospital) {
			throw new BadRequestException('Invalid or inactive hospital');
		}

		const passwordHash = await bcrypt.hash(dto.password, 10);

		const user = await this.usersService.create({
			name: dto.name,
			email: dto.email,
			passwordHash,
			role: 'staff',
			hospital: { id: dto.hospitalId } as any,
		});
		console.log('11111 user:', user);

		await this.doctorsService.create({
			userId: user.id,
			specialty: dto.specialty,
			slotDurationMinutes: dto.slotDurationMinutes,
		});

		return user;
	}

	async logout(id: number) {
		await this.usersService.update(id, { refreshTokenHash: null });
		return { message: 'Successfully logged out!' };
	}
}
