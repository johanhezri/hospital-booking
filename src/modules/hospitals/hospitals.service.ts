import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './entities/hospital.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepo: Repository<Hospital>
  ){}

  async create(createHospitalDto: CreateHospitalDto): Promise<Hospital> {
    const hospital = this.hospitalRepo.create(createHospitalDto);
    return this.hospitalRepo.save(hospital);
  }

  async findAll(): Promise<Hospital[]> {
    return this.hospitalRepo.find();
  }

  async findOne(id: number): Promise<Hospital> {
    const hospital = await this.hospitalRepo.findOne({ where: { id } });
    if (!hospital) throw new NotFoundException(`Hospital #${id} not found`);
    return hospital;
  }

  async update(id: number, updateHospitalDto: UpdateHospitalDto): Promise<Hospital> {
    const hospital = await this.findOne(id);
    Object.assign(hospital, updateHospitalDto);
    return this.hospitalRepo.save(hospital);
  }

  async remove(id: number): Promise<void> {
    const hospital = await this.findOne(id);
    await this.hospitalRepo.remove(hospital);
  }
}
