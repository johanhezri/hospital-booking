import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('doctor_working_schedules')
export class WorkingSchedule {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() hospital_id: string;
  @Column() doctor_id: string;
  @Column({ type: 'int' }) weekday: number; // 0=Sun, 6=Sat
  @Column({ type: 'time' }) start_time: string; // local time ('09:00:00')
  @Column({ type: 'time' }) end_time: string;

  @CreateDateColumn() createdAt: Date;
}