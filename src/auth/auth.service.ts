import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { SmsService } from 'src/sms/sms.service';
import { totp } from 'otplib';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterAuthYr } from './dto/register-auth-yr.dto';
import * as bcrypt from "bcrypt";
import { RegisterAuthFz } from './dto/register-auth.fz.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Request } from 'express';
import DeviceDetector from "device-detector-js";

totp.options = {
  step: 300
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly mail: MailService, private readonly sms: SmsService, private readonly jwt: JwtService){}

  async sendOtp(sendOtpDto: SendOtpDto) {
    try {
      const otp = totp.generate(sendOtpDto.email + sendOtpDto.phone + 'nima')
      // await this.sms.sendSmsToPhone(sendOtpDto.phone, otp)
      await this.mail.sendSmsToMail(sendOtpDto.email, 'Verification code', '..........', `<div style="text-align: center; background-color: gray; color: white; font-size: 30px; margin-top: 20px"><h1>${otp}</h1></div>`)
      return { message: 'successfully sent sms' }
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    try {
      const verifyOtp = totp.verify({ token: verifyOtpDto.otp, secret: verifyOtpDto.email + verifyOtpDto.phone + 'nima' })
      return verifyOtp
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async registerFz(data: RegisterAuthFz) {
    try {
      const findone = await this.prisma.user.findFirst({ where: { phone: data.phone }})
      if (findone) throw new BadRequestException('User already exists')
      const findregion = await this.prisma.region.findFirst({ where: { id: data.regionId }})
      if(!findregion) throw new BadRequestException('Region not found')
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      return await this.prisma.user.create({ data: { ...data, password: hashedPassword }})
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async registerYr(data: RegisterAuthYr) {
    try {
      const findone = await this.prisma.user.findFirst({ where: { phone: data.phone }})
      if (findone) throw new BadRequestException('User already exists')
      const findregion = await this.prisma.region.findFirst({ where: { id: data.regionId }})
      if(!findregion) throw new BadRequestException('Region not found')
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      return await this.prisma.user.create({ data: { ...data, password: hashedPassword, role: 'USER_YUR' }})
    } catch (error) {
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async login(loginAuthDto: LoginAuthDto, req: Request) {
    try {
      const findone = await this.prisma.user.findFirst({ where: { email: loginAuthDto.email }})
      if (!findone) throw new BadRequestException('User not found')
      const matchPassword = bcrypt.compareSync(loginAuthDto.password, findone.password)
      if (!matchPassword) throw new BadRequestException('Login or password not provided')
      const accessToken = this.jwt.sign(
        { id: findone.id, role: findone.role },
        { expiresIn: '30m' }
      );
      const refreshToken = this.jwt.sign(
        { id: findone.id, role: findone.role },
        { expiresIn: '15d' }
      );

      const deviceDetector = new DeviceDetector();
      const device = deviceDetector.parse(req.headers['user-agent'] || '');
      
      const deviceName = `${device.client?.name || 'Unknown Client'} on ${device.os?.name || 'Unknown OS'}`;

      const userIp = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';

      await this.prisma.session.create({
        data: {
          userId: findone.id,
          userIp,
          device: deviceName,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), 
        },
      });

      return { accessToken, refreshToken }
    } catch (error) {
      console.log(error);
      
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto
      if (!refreshToken) throw new BadRequestException('RefreshToken not found')
      const verifyToken = this.jwt.verify(refreshToken)
      const user = await this.prisma.user.findFirst({ where: { id: verifyToken.id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const newAccessToken = this.jwt.sign({ id: user.id, role: user.role }, { expiresIn: '15m' });
      return { accesToken: newAccessToken }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error 
      }
      if (error instanceof BadRequestException) {
        throw error; 
      }
      console.log(error.message);
      throw new InternalServerErrorException(error.message || 'Internal server error')
    }
  }
}
