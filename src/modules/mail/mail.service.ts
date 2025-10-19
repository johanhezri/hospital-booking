import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendHospitalCreatedNotification(email: string, hospitalName: string) {
		await this.mailerService.sendMail({
			to: email,
			subject: 'Successfully Registered Hospital',
			text: `Hospital "${hospitalName}" has been registered.`,
			html: `<p>Hospital <strong>${hospitalName}</strong> has been successfully registered.</p>`,
		});
	}

	async sendExampleNotification(email: string, data: string) {
		await this.mailerService.sendMail({
			to: email,
			subject: 'test Email Notification',
			text: `username: ${data}`,
			html: `${data}`,
		});
	}

	async sendAppointmentReminderMail({
		data,
		time,
		to,
		html,
	}: {
		data: any;
		time: string;
		to: string;
		html?: string;
	}) {
		const text = `Hi ${data.appt.patient.name}, you have an appointment tomorrow at ${time}.`;
		const subject = `Appointment Reminder with Dr. ${data.appt.doctor.user.name}`;
		// console.log('to:', to, 'subject:', subject, 'text:', text);

		return this.mailerService.sendMail({
			to,
			subject,
			text,
			html: html || `<p>${text}</p>`,
		});
	}
}
