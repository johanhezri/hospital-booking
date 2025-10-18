import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Doctor]),
		DoctorsModule,
		HospitalsModule,
		UsersModule,
	],
	controllers: [DoctorsController],
	providers: [DoctorsService],
	exports: [DoctorsService]
})
export class DoctorsModule {}
