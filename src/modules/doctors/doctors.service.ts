import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorsService {
	constructor(
		@InjectRepository(Doctor) private repo: Repository<Doctor>,
		private usersService: UsersService
	) {}

	async create(dto: CreateDoctorDto) {
		const user = await this.usersService.findOne(dto.userId);
		if (!user) throw new BadRequestException('User not found');

		return this.repo.save({
			user,
			specialty: dto.specialty,
			slotDurationMinutes: dto.slotDurationMinutes || 15,
		});
	}

	findAll() {
		return this.repo.find();
	}

	findOne(id: string, options?: FindOneOptions<Doctor>) {
		return this.repo.findOne({ where: { id }, ...options });
	}

	update(id: number, updateDoctorDto: UpdateDoctorDto) {
		return `This action updates a #${id} doctor`;
	}

	remove(id: number) {
		return `This action removes a #${id} doctor`;
	}
}
