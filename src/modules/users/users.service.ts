import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	async create(data: Partial<User>) {
		const user = this.repo.create(data);
		return this.repo.save(user);
	}

	async findByEmail(email: string) {
		return this.repo.findOne({ where: { email } });
	}

	findAll() {
		return `This action returns all users`;
	}

	findOne(id: string) {
		return this.repo.findOne({ where: { id } });
	}

	findOneByEmail(email: string) {
		return this.repo.findOne({ where: { email } });
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return this.repo.update(id, updateUserDto); // TODO update dto
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
