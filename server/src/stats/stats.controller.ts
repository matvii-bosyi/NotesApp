import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { StatsService } from './stats.service';
import type { Request } from 'express';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getStats(@Req() req: Request) {
    return this.statsService.getStatsForUser(req.user.id);
  }
}
