import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async validateUser(username: string, password: string): Promise<any> {
		const user = { username: 'test', passwordHash: await bcrypt.hash('1234', 10) };
    // console.log('validateUser===== user:', user);
    
		const isValid = await bcrypt.compare(password, user.passwordHash);
    // console.log('validateUser===== isValid:', isValid);

		if (username === user.username && isValid) {
			const { passwordHash, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: any) {
		const payload = { username: user.username, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
