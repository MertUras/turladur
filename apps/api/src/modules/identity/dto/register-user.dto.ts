import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Demo1234!',
    description: 'Min 8 chars, 1 uppercase, 1 digit',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Şifre en az 1 büyük harf ve 1 rakam içermelidir',
  })
  password!: string;

  @ApiPropertyOptional({ example: 'Ali' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Yılmaz' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({ example: '+905551234567' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone!: string;

  @ApiProperty({
    example: '10000000146',
    description: 'TC Kimlik No (11 hane)',
  })
  @IsString()
  @Matches(/^[1-9][0-9]{10}$/, {
    message: 'TC Kimlik No 11 haneli ve geçerli olmalıdır',
  })
  identityNumber!: string;

  @ApiProperty({ example: 'Çankaya Mah. …, Ankara' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  address!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit email OTP (purpose=REGISTER)',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d{6}$/)
  otpCode!: string;
}
