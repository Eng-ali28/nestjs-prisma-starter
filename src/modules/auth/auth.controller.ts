import { Body, Controller, Get, Inject, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RegisterUser } from './types/signup.types';
import { LoginDto } from './dto/login.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from './decorator/currentuser.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { Payload } from './types/payload.types';
import Auth from './decorator/auth.decorator';
import { AuthRequest } from './types/authUser.types';
import { AuthService } from './auth.service';
import UserService from '../user/user.service';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Auth()
  @Get('healthy')
  healthy(): string {
    return this.authService.healthy();
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<RegisterUser> {
    return await this.authService.signup(signUpDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<RegisterUser> {
    return await this.authService.login(loginDto);
  }

  @Get('logout')
  @Auth()
  async logout(@User() user: Payload) {
    await this.authService.logout(user.userId);
    return 'Logout successfully';
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: AuthRequest) {
    const userId = req.user.userId;
    const refreshToken = req.user.refreshToken;
    const isActive = req.user.isActive;
    const roleId = req.user.roleId;
    return this.authService.refreshTokens({ userId, refreshToken, isActive, roleId: '' });
  }
}
