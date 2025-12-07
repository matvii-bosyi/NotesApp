import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { hash, verify } from 'argon2';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { isDev } from 'src/utils/is-dev';

@Injectable()
export class AuthService {
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('jwt-refresh')
    private readonly jwtRefreshService: JwtService,
  ) {
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(dto: RegisterUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async login(res: Response, dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await verify(user.password, dto.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return this.auth(res, user.id);
  }

  async verifyEmail(res: Response, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });
    if (!user) throw new UnauthorizedException('Invalid token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: null },
    });

    return this.auth(res, user.id);
  }

  async refresh(res: Response, userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const isRefreshTokenValid = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Access Denied');
    }

    return this.auth(res, user.id);
  }

  async logout(res: Response, userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null, verificationToken: null },
    });
    this.clearCookie(res);
    return true;
  }

  async validate(payload: IJwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  private async auth(res: Response, userId: string) {
    const { accessToken, refreshToken } = this.generateTokens(userId);
    await this.updateRefreshTokenHash(userId, refreshToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  private generateTokens(id: string) {
    const payload: IJwtPayload = { id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtRefreshService.sign(payload);
    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES',
    );
    const days = parseInt(refreshExpiresIn, 10);
    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    res.cookie('refreshToken', token, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }

  private clearCookie(res: Response) {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires: new Date(0),
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
