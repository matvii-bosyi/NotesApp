import type { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user: User & { refreshToken?: string };
    cookies: Record<string, string>;
  }
}
