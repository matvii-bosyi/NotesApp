import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagService } from 'src/tag/tag.service';
import { SearchNoteDto } from './dto/search-note.dto';

@Injectable()
export class NoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagService: TagService,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    const { tags: tagNames, ...noteData } = createNoteDto;

    const tags = await this.tagService.findOrCreate(userId, tagNames || []);

    return this.prisma.note.create({
      data: {
        ...noteData,
        userId,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: { tags: true },
    });
  }

  async findAll(userId: string, searchParams?: SearchNoteDto) {
    const where: Prisma.NoteWhereInput = {
      userId,
    };

    const { title, content, tags } = searchParams || {};

    if (title || content || tags) {
      where.AND = [];

      if (title) {
        where.AND.push({
          title: {
            contains: title,
            mode: 'insensitive',
          },
        });
      }

      if (content) {
        where.AND.push({
          content: {
            contains: content,
            mode: 'insensitive',
          },
        });
      }

      if (tags) {
        const tagNames = tags.split(',').map((tag) => tag.trim());
        if (tagNames.length > 0) {
          where.AND.push({
            tags: {
              some: {
                name: {
                  in: tagNames,
                  mode: 'insensitive',
                },
              },
            },
          });
        }
      }
    }

    return this.prisma.note.findMany({
      where,
      include: { tags: true },
    });
  }

  async findOne(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('You are not authorized to view this note');
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    if (note.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this note',
      );
    }

    const { tags: tagNames, ...noteData } = updateNoteDto;
    const updateData: Prisma.NoteUpdateInput = { ...noteData };

    if (tagNames !== undefined) {
      const tags = await this.tagService.findOrCreate(userId, tagNames);
      updateData.tags = {
        set: tags.map((tag) => ({ id: tag.id })),
      };
    }

    return this.prisma.note.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });
  }

  async remove(id: string, userId: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    if (note.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this note',
      );
    }
    await this.prisma.note.delete({ where: { id } });
    return true;
  }
}
