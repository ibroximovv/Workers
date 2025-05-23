import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterAuthFz } from './dto/register-auth.fz.dto';
import { RegisterAuthYr } from './dto/register-auth-yr.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto)
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto)
  }

  @Post('register-fz')
  registerFz(@Body() registerFzDto: RegisterAuthFz) {
    return this.authService.registerFz(registerFzDto)
  }

  @Post('register-yr')
  registerYr(@Body() registerYrDto: RegisterAuthYr) {
    return this.authService.registerFz(registerYrDto)
  }

  @Post('login')
  login(@Body() login: LoginAuthDto, @Req() req: Request) {
    return this.authService.login(login, req)
  }

  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }
}
