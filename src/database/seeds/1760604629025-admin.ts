import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class Admin1760604629025 implements Seeder {
	track = false;

	public async run(dataSource: DataSource): Promise<any> {
		const repo = dataSource.getRepository(User);

		const exists = await repo.findOne({ where: { email: 'admin@system.com' } });
		if (exists) {
			console.log('Admin already exists.');
			return;
		}

		const passwordHash = await bcrypt.hash('admin@123', 10);

		await repo.insert({
			hospital: undefined,
			name: 'System Administrator',
			email: 'admin@system.com',
			passwordHash,
			role: 'admin',
		});

		console.log('Admin user seeded successfully!');
	}
}
