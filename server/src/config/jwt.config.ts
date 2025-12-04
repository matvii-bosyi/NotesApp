import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';

export function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  const expiresIn = (configService.get<string>('JWT_ACCESS_EXPIRES') ??
    '15m') as SignOptions['expiresIn'];

  return {
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      algorithm: 'HS256',
      expiresIn,
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}

export function getJwtRefreshConfig(
  configService: ConfigService,
): JwtModuleOptions {
  const refreshExpiresIn = (configService.get<string>('JWT_REFRESH_EXPIRES') ??
    '7d') as SignOptions['expiresIn'];

  return {
    secret: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    signOptions: {
      algorithm: 'HS256',
      expiresIn: refreshExpiresIn,
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}
