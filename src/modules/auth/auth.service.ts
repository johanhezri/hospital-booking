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
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private jwtService: JwtService,
		private readonly usersService: UsersService
	) {}

	async validateUser(body: LoginDto): Promise<any> {
		const { email, password } = body;

		const user = await this.userRepository.findOne({
			where: { email },
		});
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}
		console.log('===== user:', user);

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

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
}
