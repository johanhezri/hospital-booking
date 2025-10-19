import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Between, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalsService } from '../hospitals/hospitals.service';
import { DoctorsService } from '../doctors/doctors.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppointmentsService {
	constructor(
		@InjectRepository(Appointment)
		private repo: Repository<Appointment>,
		private readonly hospitalsService: HospitalsService,
		private readonly doctorsService: DoctorsService,
		private readonly usersService: UsersService
	) {}

	async create(dto: CreateAppointmentDto, createdByStaffId?: string) {
		const hospital = await this.hospitalsService.findActiveById(dto.hospitalId);
		if (!hospital)
			throw new BadRequestException('Hospital not found or inactive');

		const doctor = await this.doctorsService.findOne(dto.doctorId, {
			relations: ['user', 'user.hospital'],
		});

		if (!doctor) throw new BadRequestException('Doctor not found');

		if (!doctor.user?.hospital?.id) {
			throw new BadRequestException('Doctor is not assigned to any hospital');
		}
		if (doctor.user.hospital.id !== hospital.id) {
			throw new BadRequestException('Doctor does not belong to this hospital');
		}

		const patient = await this.usersService.findOne(dto.patientId);
		if (!patient) throw new BadRequestException('Patient not found');

		const startsAt = new Date(dto.startsAt);
		const endsAt = new Date(dto.endsAt);
		if (startsAt <= new Date() || endsAt <= startsAt) {
			throw new BadRequestException(
				'Appointment must be in the future and ends after start'
			);
		}

		const overlap = await this.repo
			.createQueryBuilder('appointment')
			.where('appointment.doctor_id = :doctorId', { doctorId: dto.doctorId })
			.andWhere(
				'appointment.status = :status AND ((appointment.starts_at, appointment.ends_at) OVERLAPS (:start, :end))',
				{
					status: 'booked',
					start: startsAt.toISOString(),
					end: endsAt.toISOString(),
				}
			)
			.getOne();

		if (overlap)
			throw new BadRequestException(
				'Doctor already has an appointment in this time range'
			);

		const appointment = this.repo.create({
			hospital,
			doctor,
			patient,
			starts_at: startsAt,
			ends_at: endsAt,
			status: 'booked',
			created_by_staff_id: createdByStaffId || undefined,
		});

		return this.repo.save(appointment);
	}

	findAll(): Promise<Appointment[]> {
		return this.repo.find();
	}

	findOne(id: string) {
		return this.repo.findOne({ where: { id } });
	}

	// update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
	// 	return `This action updates a #${id} appointment`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} appointment`;
	// }

	async findBookedBetween(start: Date, end: Date) {
		return this.repo
			.createQueryBuilder('a')
			.leftJoin('a.doctor', 'd')
			.leftJoin('d.user', 'du')
			.leftJoin('a.patient', 'p')
			.select([
				'a.id',
				'a.starts_at',
				'a.ends_at',
				'a.status',
				'a.hospital_id',

				'd.id',
				'du.id',
				'du.name',
				'du.email',

				'p.id',
				'p.name',
				'p.email',
			])
			.where('a.status = :status', { status: 'booked' })
			.andWhere('a.starts_at BETWEEN :start AND :end', { start, end })
			.getMany();
	}
}
