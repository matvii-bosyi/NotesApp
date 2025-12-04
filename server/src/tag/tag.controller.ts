import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { TagService } from './tag.service';
import type { Request } from 'express';

@Controller('tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.tagService.findAllByUserId(req.user.id);
  }
}
