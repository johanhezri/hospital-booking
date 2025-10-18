import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Hospital } from './entities/hospital.entity';

@Injectable()
export class HospitalsService {
	constructor(
		@InjectRepository(Hospital)
		private readonly hospitalRepo: Repository<Hospital>
	) {}

	async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
		const hospital = this.hospitalRepo.create(createHospitalDto);
		return this.hospitalRepo.save(hospital);
	}

	async findAll(): Promise<Hospital[]> {
		return this.hospitalRepo.find();
	}

	async findOne(id: number): Promise<Hospital> {
		const hospital = await this.hospitalRepo.findOne({ where: { id } });
		if (!hospital)
			throw new NotFoundException(`Hospital with ID ${id} not found`);
		return hospital;
	}

	async findActiveById(id: number): Promise<Hospital | null> {
  return this.hospitalRepo.findOne({
    where: { id, deletedAt: IsNull()  },
  });
}

	async update(
		id: number,
		updateHospitalDto: UpdateHospitalDto
	): Promise<Hospital> {
		const hospital = await this.findOne(id);
		Object.assign(hospital, updateHospitalDto);
		return this.hospitalRepo.save(hospital);
	}

	async remove(id: number) {
		const hospital = await this.findOne(id);
		if (!hospital) {
			throw new NotFoundException(`Hospital with ID ${id} not found`);
		}

		await this.hospitalRepo.softDelete(hospital.id);

		return {
			message: `Successfully deleted hospital with ID ${id}.`,
			deletedAt: new Date().toISOString(),
		};
	}
}
