import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubUserDto {
  @ApiProperty({ example: 'Ayşe Yılmaz' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: 'ayse@acme.com' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  email!: string;

  @ApiPropertyOptional({
    description:
      'Yeni staff e-postası için zorunlu (müşteri hesabı kullanılamaz)',
    example: 'StaffPass1',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Şifre en az 1 büyük harf ve 1 rakam içermelidir',
  })
  password?: string;

  @ApiPropertyOptional({ example: 'MANAGER', default: 'USER' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  role?: string;

  @ApiPropertyOptional({
    example: { tours: ['read', 'write'], reservations: ['read'] },
  })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, unknown>;
}

export class UpdateSubUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: 'MANAGER' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  role?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, unknown>;
}
