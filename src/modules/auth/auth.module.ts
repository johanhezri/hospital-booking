import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailService } from '../mail/mail.service';
import { UsersModule } from '../users/users.module';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '15m' },
		}),
		UsersModule,
		HospitalsModule,
		DoctorsModule
	],
	providers: [AuthService, MailService, JwtStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
