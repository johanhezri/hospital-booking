import { forwardRef, Module } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingSchedule } from './entities/working-schedule.entity';
import { DoctorsModule } from '../doctors/doctors.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([WorkingSchedule]),
		forwardRef(() => DoctorsModule),
		forwardRef(() => AppointmentsModule),
	],
	controllers: [CalendarsController],
	providers: [CalendarsService],
	exports: [CalendarsService],
})
export class CalendarsModule {}
