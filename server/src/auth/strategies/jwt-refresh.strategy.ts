import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request as ExpressRequest } from 'express';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

interface Request extends ExpressRequest {
  cookies: Record<string, string>;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const refreshToken = req.cookies?.['refreshToken'];
          return typeof refreshToken === 'string' ? refreshToken : null;
        },
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: IJwtPayload,
  ): IJwtPayload & { refreshToken: string | undefined } {
    const refreshTokenValue = req.cookies?.['refreshToken'];
    const refreshToken =
      typeof refreshTokenValue === 'string' ? refreshTokenValue : undefined;
    return { ...payload, refreshToken };
  }
}
