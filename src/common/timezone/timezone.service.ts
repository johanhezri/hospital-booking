import { DateTime } from 'luxon';

export class TimezoneService {
   static toUTC(localIso: string, tz: string) {
    return DateTime.fromISO(localIso, { zone: tz }).toUTC().toISO();
  }
  static toLocal(utcIso: string, tz: string) {
    return DateTime.fromISO(utcIso, { zone: 'utc' }).setZone(tz).toISO();
  }
  static intervalForDate(dateStr: string, tz: string, startTime: string, endTime: string) {
    // combine date & local time
    const startLocal = DateTime.fromISO(`${dateStr}T${startTime}`, { zone: tz });
    const endLocal = DateTime.fromISO(`${dateStr}T${endTime}`, { zone: tz });

    if (!startLocal.isValid || !endLocal.isValid) {
      throw new Error('Invalid date or time input');
    }

    // convert to UTC for db
    const startUtc = startLocal.toUTC().toISO();
    const endUtc = endLocal.toUTC().toISO();

    return { startUtc, endUtc };
  }
}
