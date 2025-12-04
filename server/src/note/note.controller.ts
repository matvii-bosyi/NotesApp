import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { Request } from 'express';
import { SearchNoteDto } from './dto/search-note.dto';

@UseGuards(JwtAuthGuard)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Req() req: Request) {
    return this.noteService.create(createNoteDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: Request, @Query() searchNoteDto: SearchNoteDto) {
    return this.noteService.findAll(req.user.id, searchNoteDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.noteService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: Request,
  ) {
    return this.noteService.update(id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.noteService.remove(id, req.user.id);
  }
}
