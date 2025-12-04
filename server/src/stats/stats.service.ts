import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatsForUser(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalNotes,
      notesCreatedLastWeek,
      userTags,
      notesByDay,
      allUserNotes,
    ] = await Promise.all([
      this.prisma.note.count({
        where: { userId },
      }),
      this.prisma.note.count({
        where: {
          userId,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      this.prisma.tag.findMany({
        where: { userId },
        include: {
          _count: {
            select: { notes: true },
          },
        },
      }),
      this.prisma.$queryRaw`
        SELECT
          to_char("created_at", 'FMDay') as day,
          COUNT(*)::int as count
        FROM "notes"
        WHERE "user_id" = ${userId}
        GROUP BY EXTRACT(ISODOW FROM "created_at"), day
        ORDER BY EXTRACT(ISODOW FROM "created_at");
      `,
      this.prisma.note.findMany({
        where: { userId },
        select: { content: true },
      }),
    ]);

    const mostUsedTags = userTags
      .map((tag) => ({
        tag: tag.name,
        count: tag._count.notes,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const notesByDayOfWeek = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    for (const item of notesByDay as { day: string; count: number }[]) {
      notesByDayOfWeek[item.day] = item.count;
    }

    let averageNoteLength = 0;
    if (allUserNotes.length > 0) {
      const totalWords = allUserNotes.reduce((sum, note) => {
        const wordCount = note.content
          ? note.content.split(/\s+/).filter(Boolean).length
          : 0;
        return sum + wordCount;
      }, 0);
      averageNoteLength = totalWords / allUserNotes.length;
    }

    return {
      totalNotes,
      notesCreatedLastWeek,
      mostUsedTags,
      notesByDayOfWeek,
      averageNoteLength,
    };
  }
}
