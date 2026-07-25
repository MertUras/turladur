import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export enum OtpPurposeDto {
  CHECKOUT = 'CHECKOUT',
  REGISTER = 'REGISTER',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export class SendOtpDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: OtpPurposeDto })
  @IsEnum(OtpPurposeDto)
  purpose!: OtpPurposeDto;

  @ApiPropertyOptional({
    example: 'Ali',
    description: 'Greeting name in OTP email',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: OtpPurposeDto })
  @IsEnum(OtpPurposeDto)
  purpose!: OtpPurposeDto;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code!: string;

  @ApiProperty({
    example: 'YeniSifre1',
    description: 'Min 8 chars, 1 uppercase, 1 digit',
  })
  @IsString()
  @Length(8, 100)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Şifre en az 1 büyük harf ve 1 rakam içermelidir',
  })
  newPassword!: string;
}
