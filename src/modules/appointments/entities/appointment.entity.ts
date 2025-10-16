import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { User } from '../../users/entities/user.entity';

@Entity('appointments')
export class Appointment {
	@PrimaryGeneratedColumn('uuid') id: string;
	@Column() hospital_id: string;
	@Column() doctor_id: string;
	@Column() patient_id: string;
	@Column({ type: 'timestamptz' }) starts_at;
	@Column({ type: 'timestamptz' }) ends_at;
	@Column({ type: 'enum', enum: ['booked', 'cancelled', 'completed'] })
	status: string;
	@CreateDateColumn() createdAt: Date;

	@Index()
	@Column({ nullable: true })
	created_by_staff_id: string;

	@ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'doctor_id' })
	doctor: Doctor;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'patient_id' })
	patient: User;

	@ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'hospital_id' })
	hospital: Hospital;
}
