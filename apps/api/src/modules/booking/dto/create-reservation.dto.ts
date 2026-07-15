import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class BookingGuestDto {
  @ApiProperty({ example: 'Ahmet' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: 'Yılmaz' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  birthDate?: string;

  @ApiPropertyOptional({ example: '12345678901' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  identityNumber?: string;
}

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  tourDateId!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(50)
  adults!: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  children?: number = 0;

  @ApiProperty({ example: 'musteri@example.com' })
  @IsEmail()
  contactEmail!: string;

  @ApiPropertyOptional({ example: '+905551112233' })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  contactPhone?: string;

  @ApiProperty({ type: [BookingGuestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookingGuestDto)
  guests!: BookingGuestDto[];
}
