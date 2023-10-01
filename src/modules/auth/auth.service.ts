import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterUser } from './types/signup.types';
import { Payload } from './types/payload.types';
import * as bcrypt from 'bcryptjs';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { VerifyUserDto } from './dto/verify-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { SignUpDto } from './dto/signup.dto';

import { ConfigService } from '@nestjs/config';
import UserService from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,

    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  healthy(): string {
    return 'Done.';
  }

  async signup(signUpDto: SignUpDto): Promise<RegisterUser> {
    const { role, password, ...data } = signUpDto;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await this.userService.hashPassoword(password),
        role: { connect: { name: role } },
      },
    });

    const payload: Payload = {
      userId: user.id,
      isActive: user.isActive,
      roleId: user.roleId,
    };
    const tokens = await this.getTokens(payload);
    const hashRefreshToken = await this.hashToken(tokens.refreshToken);

    await this.userService.updateUserById(user.id, {
      refreshToken: hashRefreshToken,
    });

    return {
      ...user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<RegisterUser> {
    let user = await this.userService.getUserByPhone(loginDto.phoneNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid phone or password.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid phone or password.');
    }

    const payload: Payload = {
      userId: user.id,
      isActive: user.isActive,
      roleId: user.roleId,
    };

    loginDto.firebaseToken ? (user = await this.userService.updateUserById(user.id, { firebaseToken: loginDto.firebaseToken })) : null;

    const tokens = await this.getTokens(payload);
    const hashRefreshToken = await this.hashToken(tokens.refreshToken);

    await this.userService.updateUserById(user.id, {
      refreshToken: hashRefreshToken,
    });

    return {
      ...user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async getTokens(payload: Payload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXP'),
        },
      ),
      this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXP'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateUserById(userId, { refreshToken: '' });
  }

  async refreshTokens({ refreshToken, userId }: Payload): Promise<RegisterUser> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new ForbiddenException('Access Denied');

    const oldRefreshToken = await this.userService.getUserById(userId);

    const refreshTokenMatches = await argon2.verify(oldRefreshToken.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const payload: Payload = {
      userId: user.id,
      roleId: user.roleId,
      isActive: user.isActive,
    };
    const tokens = await this.getTokens(payload);

    const hashRefreshToken = await this.hashToken(tokens.refreshToken);

    await this.userService.updateUserById(user.id, {
      refreshToken: hashRefreshToken,
    });

    return {
      ...user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async hashToken(data: string) {
    return await argon2.hash(data);
  }
}
