import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppError } from 'src/dto/error.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtServvice: JwtService,
  ) {}

  async registerUser(registerUserDto: Prisma.AssimUserCreateInput) {
    try {
      const isUser = await this.prismaService.assimUser.findUnique({
        where: { email: registerUserDto.email },
      });

      if (isUser) {
        throw new AppError('User already exists', 400);
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      registerUserDto.password = await bcrypt.hash(
        registerUserDto.password,
        salt,
      );
      const isRegister = await this.prismaService.assimUser.create({
        data: registerUserDto,
      });
      if (isRegister) {
        return {
          message: 'User registered successfully',
          success: true,
        };
      }

      throw new Error('User registration failed');
    } catch (error) {
      if (error instanceof AppError) {
        throw new HttpException(
          {
            message: error.message,
            success: false,
          },
          error.statusCode,
          { cause: error },
        );
      } else {
        throw new HttpException(
          {
            message: 'Internal Server Error',
            success: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }
  }

  async loginUser(loginUserDto: Prisma.AssimUserWhereUniqueInput) {
    try {
      const user = await this.prismaService.assimUser.findUnique({
        where: { email: loginUserDto.email },
      });
      if (!user) {
        throw new AppError('User not found', 404);
      }
      const { password, ...userDetails } = user;

      const isPasswordMatch = await bcrypt.compare(
        loginUserDto.password as string,
        password,
      );

      if (!isPasswordMatch) {
        throw new AppError('Invalid credentials', 400);
      }

      const accessToken = await this.jwtServvice.signAsync({
        id: userDetails.id,
        email: userDetails.email,
      });
      return {
        message: 'User logged in successfully',
        success: true,
        user: userDetails,
        accessToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw new HttpException(
          {
            message: error.message,
            success: false,
          },
          error.statusCode,
          { cause: error },
        );
      } else {
        throw new HttpException(
          {
            message: 'Internal Server Error',
            success: false,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: error },
        );
      }
    }
  }
}
