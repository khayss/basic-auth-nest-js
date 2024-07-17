import { EmploymentStatus } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsNumberString()
  @MinLength(10)
  phoneNumber: string;

  @IsEnum(EmploymentStatus)
  employmentStatus: EmploymentStatus;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
