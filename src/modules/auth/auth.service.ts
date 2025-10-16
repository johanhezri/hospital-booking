import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) //! remove
		private readonly userRepository: Repository<User>, //! remove
		private readonly usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(body: LoginDto): Promise<any> {
		const { email, password } = body;

		const user = await this.userRepository.findOne({
			where: { email },
		});
		if (!user) throw new UnauthorizedException('Invalid credentials');
		console.log('===== user:', user);

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid)
			throw new UnauthorizedException('Invalid credentials');

		const { passwordHash, refreshTokenHash, ...result } = user;
		return result;
	}

	async login(user: any) {
		const payload = { username: user.username, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async register(dto: RegisterDto) {
		// register patient
		// TODO register staff
		const existing = await this.usersService.findByEmail(dto.email);
		if (existing) throw new ConflictException('Email already registered');

		const passwordHash = await bcrypt.hash(dto.password, 10);

		const newUser = await this.usersService.create({
			name: dto.name,
			email: dto.email,
			passwordHash,
			role: 'patient',
			hospital: dto.hospitalId
				? ({ id: Number(dto.hospitalId) } as any)
				: undefined,
		});

		return newUser;
	}

	async generateTokens(user: any) {
		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role,
			hospitalId: user.hospital?.id || null,
		};

		const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

		// hash refresh token before storing
		const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
		await this.userRepository.update(user.id, { refreshTokenHash });

		return { accessToken, refreshToken };
	}

	async refreshTokens(refreshToken: string) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: process.env.JWT_SECRET || '100100',
			});

			const user = await this.userRepository.findOne({
				where: { id: payload.sub },
			});
			if (!user || !user.refreshTokenHash) {
				throw new UnauthorizedException('Invalid refresh token');
			}

			// verify the hash
			const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
			if (!match) throw new UnauthorizedException('Invalid refresh token');

			return this.generateTokens(user);
		} catch {
			throw new UnauthorizedException('Refresh token expired or invalid');
		}
	}
}
