import { Injectable, Logger } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { MailService } from '../mail/mail.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';

@Injectable()
export class RemindersService {
	private readonly logger = new Logger(RemindersService.name);

	constructor(
		private readonly appointmentsService: AppointmentsService,
		private readonly mailService: MailService,
		private readonly hospitalsService: HospitalsService
	) {}

	// @Cron(CronExpression.EVERY_DAY_AT_8AM)
	@Cron('*/1 * * * *') // every 15sec
	// @Cron('*/15 * * * * *') // every 15sec
	async handleDailyReminders() {
		this.logger.log('Running daily appointment reminder job...');

		const utcNow = DateTime.utc();
		const nextDayStart = utcNow.plus({ days: 1 }).startOf('day').toJSDate();
		const nextDayEnd = utcNow.plus({ days: 1 }).endOf('day').toJSDate();

		// Step 1: get all booked appointments for the next day
		const appointments = await this.appointmentsService.findBookedBetween(
			nextDayStart,
			nextDayEnd
		);
		this.logger.log(`===== appointments: ${JSON.stringify(appointments)}`);

		if (!appointments.length) {
			this.logger.log('No appointments found for tomorrow');
			return;
		}

		this.logger.log(`Found ${appointments.length} appointments for tomorrow.`);

		// Step 2: send reminders
		for (const appt of appointments) {
			try {
				const hospital = await this.hospitalsService.findOne(+appt.hospital_id);
				const tz = hospital.timezone || 'UTC';
				const localTime = DateTime.fromJSDate(appt.starts_at, {
					zone: 'utc',
				}).setZone(tz);

				await this.mailService.sendMail({
					hospital,
					to: 'johan.hezri@gmail.com', // TODO get patient's email
					subject: `Appointment Reminder with Dr. ${appt.doctor_id}`,
					text: `Hi ${
						appt.patient_id
					}, you have an appointment tomorrow at ${localTime.toFormat(
						'HH:mm'
					)} (${tz}).`,
				});

				this.logger.log(
					`Reminder sent for appointment ${appt.id} ('johan.hezri@gmail.com').`
				);
			} catch (err) {
				this.logger.error(
					`Failed to send reminder for appointment ${appt.id}: ${err.message}`
				);
			}
		}

		this.logger.log('Daily reminders job completed.');
	}
}
