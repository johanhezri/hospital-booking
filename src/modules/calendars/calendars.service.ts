import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingSchedule } from './entities/working-schedule.entity';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(WorkingSchedule)
    private readonly scheduleRepo: Repository<WorkingSchedule>,
  ) {}

   async addSchedule(hospitalId: string, doctorId: string, weekday: number, start: string, end: string) {
    if (start >= end) throw new BadRequestException('Invalid time range');
    const schedule = this.scheduleRepo.create({ hospital_id: hospitalId, doctor_id: doctorId, weekday, start_time: start, end_time: end });
    return await this.scheduleRepo.save(schedule);
  }

  async getSchedulesForDoctor(doctorId: string) {
    return this.scheduleRepo.find({ where: { doctor_id: doctorId }, order: { weekday: 'ASC' } });
  }

  // get slots in UTC time for a date, following doctor's work schedule
  async getAvailableSlots(doctor, date: string, timezone: string, existingAppointments: any[]) {
    const day = DateTime.fromISO(date, { zone: timezone });
    const weekday = day.weekday % 7; // 1=Mon -> 1, want 0-6 //! check
    const schedules = await this.scheduleRepo.find({ where: { doctor_id: doctor.id, weekday } });

    if (!schedules.length) return [];

    const bookedRanges = existingAppointments.map(a => ({
      start: DateTime.fromISO(a.starts_at, { zone: 'utc' }),
      end: DateTime.fromISO(a.ends_at, { zone: 'utc' }),
    }));

    const slots: string[] = [];

    for (const sched of schedules) {
      const startLocal = DateTime.fromISO(`${date}T${sched.start_time}`, { zone: timezone });
      const endLocal = DateTime.fromISO(`${date}T${sched.end_time}`, { zone: timezone });
      let current = startLocal;

      while (current.plus({ minutes: doctor.slotDurationMinutes }) <= endLocal) {
        const slotStartUtc = current.toUTC();
        const slotEndUtc = slotStartUtc.plus({ minutes: doctor.slotDurationMinutes });

        const isTaken = bookedRanges.some(
          r => r.start < slotEndUtc && r.end > slotStartUtc,
        );

        if (!isTaken) slots.push(slotStartUtc.toISO()!);
        current = current.plus({ minutes: doctor.slotDurationMinutes });
      }
    }

    return slots;
  }
}
