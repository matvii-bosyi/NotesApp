import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUserId(userId: string) {
    return this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOrCreate(userId: string, tagNames: string[]) {
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        const existingTag = await this.prisma.tag.findUnique({
          where: { name_userId: { name, userId } },
        });

        if (existingTag) {
          return existingTag;
        }

        return this.prisma.tag.create({
          data: {
            name,
            userId,
          },
        });
      }),
    );

    return tags;
  }
}
