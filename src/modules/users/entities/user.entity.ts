import { Hospital } from '../../hospitals/entities/hospital.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid') id: string;

	@ManyToOne(() => Hospital, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn({ name: 'hospital_id' })
	hospital?: Hospital;

	@Column() email: string;
	@Column() passwordHash: string;
	@Column({ type: 'enum', enum: ['admin', 'staff', 'patient'] }) role: string;
	@Column({ nullable: true }) name: string;
	@CreateDateColumn() createdAt: Date;

	@Index()
	@Column({ nullable: true })
	refreshTokenHash?: string;
}
