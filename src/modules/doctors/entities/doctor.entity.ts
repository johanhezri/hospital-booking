import { Appointment } from '../../appointments/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() hospital_id: string;
  @Column() name: string;
  @Column() specialty: string;
  @Column({ type: 'int', default: 15 }) slotDurationMinutes: number;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
