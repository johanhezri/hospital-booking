import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':doctorId/schedules')
  async addSchedule(@Param('doctorId') doctorId: string, @Body() body, @Query('hospitalId') hospitalId: string) {
    return this.calendarsService.addSchedule(hospitalId, doctorId, body.weekday, body.start, body.end);
  }

  @Get(':doctorId/schedules')
  async getSchedules(@Param('doctorId') doctorId: string) {
    return this.calendarsService.getSchedulesForDoctor(doctorId);
  }
}
