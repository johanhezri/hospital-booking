import { User } from '../../users/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
	@PrimaryGeneratedColumn('uuid') id: string;

	@ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column() specialty: string;
	@Column({ type: 'int', default: 15 }) slotDurationMinutes: number;

	@OneToMany(() => Appointment, (appointment) => appointment.doctor)
	appointments: Appointment[];
}
