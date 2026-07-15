import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  paymentId!: string;

  @ApiPropertyOptional({ description: 'Partial refund amount; omit for full' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;
}
