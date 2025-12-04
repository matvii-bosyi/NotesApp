import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [TagModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
