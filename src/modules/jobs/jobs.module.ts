import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppointmentsModule } from '../appointments/appointments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { RemindersService } from './reminders.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppointmentsModule,
    MailerModule,
    HospitalsModule,
    MailModule
  ],
  providers: [RemindersService],
})
export class JobsModule {}
