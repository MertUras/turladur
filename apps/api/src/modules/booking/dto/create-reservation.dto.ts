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
  ValidateIf,
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

  @ApiProperty({ example: '10000000146' })
  @IsString()
  @Matches(/^[1-9][0-9]{10}$/, {
    message: 'TC kimlik no 11 haneli olmalıdır',
  })
  identityNumber!: string;

  @ApiProperty({ example: '+905551112233' })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone!: string;

  @ApiProperty({ example: 'ahmet@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Kadıköy, İstanbul' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  address?: string;
}

export class ReservationBillingDto {
  @ApiProperty({ example: 'Bağdat Cad. No:1' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  line1!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  line2?: string;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiProperty({ example: 'Türkiye' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  country!: string;

  @ApiPropertyOptional({ description: 'Vergi / TC for invoice' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  taxId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;
}

/**
 * Exactly one product path must be provided:
 * - tour: tourDateId
 * - hotel: roomId (+ optional hotelId, startDate/endDate required)
 * - experience: activityDateId
 */
export class CreateReservationDto {
  @ApiPropertyOptional({ description: 'Tour booking' })
  @ValidateIf((o: CreateReservationDto) => !o.roomId && !o.activityDateId)
  @IsString()
  @MinLength(1)
  tourDateId?: string;

  @ApiPropertyOptional({ description: 'Hotel booking — room id' })
  @ValidateIf((o: CreateReservationDto) => !o.tourDateId && !o.activityDateId)
  @IsString()
  @MinLength(1)
  roomId?: string;

  @ApiPropertyOptional({ description: 'Hotel id (optional if roomId given)' })
  @IsOptional()
  @IsString()
  hotelId?: string;

  @ApiPropertyOptional({
    example: '2026-08-10',
    description: 'Hotel check-in (required for hotel bookings)',
  })
  @ValidateIf((o: CreateReservationDto) => Boolean(o.roomId))
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-08-12',
    description: 'Hotel check-out (required for hotel bookings)',
  })
  @ValidateIf((o: CreateReservationDto) => Boolean(o.roomId))
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate?: string;

  @ApiPropertyOptional({ description: 'Experience booking' })
  @ValidateIf((o: CreateReservationDto) => !o.tourDateId && !o.roomId)
  @IsString()
  @MinLength(1)
  activityDateId?: string;

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

  @ApiProperty({ example: '+905551112233' })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  contactPhone!: string;

  @ApiProperty({ type: [BookingGuestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookingGuestDto)
  guests!: BookingGuestDto[];

  @ApiProperty({ description: 'Fatura / billing snapshot' })
  @ValidateNested()
  @Type(() => ReservationBillingDto)
  billing!: ReservationBillingDto;

  @ApiPropertyOptional({
    description: 'Free-form special requests / conditions JSON',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  specialRequests?: string;
}
