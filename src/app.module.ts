import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CalendarsModule } from './modules/calendars/calendars.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { RolesGuard } from './modules/common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/common/guards/jwt-auth.guard';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...databaseConfig,
			autoLoadEntities: true,
		}),
		MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT || 587,
				secure: false, // true for port 465, false for others
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			},
			defaults: {
				from: '"Hospital Booking" <no-reply@hospital.com>',
			},
		}),
		HospitalsModule,
		AuthModule,
		UsersModule,
		DoctorsModule,
		AppointmentsModule,
		CalendarsModule,
		AppointmentsModule,
		JobsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
