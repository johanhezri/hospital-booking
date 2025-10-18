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
		// console.log('[mailservice] 1...');
		// console.log('email:', email);
		// console.log('data:', data);
		await this.mailerService.sendMail({
			to: email,
			subject: 'test Email Notification',
			text: `username: ${data}`,
			html: `${data}`,
		});
	}

	async sendMail({ hospital, to, subject, text }) {
		await this.mailerService.sendMail({
			to,
			subject: 'Successfully Registered Hospital',
			text: `Hospital "${hospital.name}" has been registered.`,
			html: `<p>Hospital <strong>${hospital.name}</strong> has been successfully registered.</p>`,
		});
	}
}
