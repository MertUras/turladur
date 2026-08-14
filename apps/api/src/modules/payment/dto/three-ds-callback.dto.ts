import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

/** Body posted by İyzico (or mock 3DS form) after bank challenge. */
export class ThreeDsCallbackDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  conversationId!: string;

  @ApiProperty({ example: 'success' })
  @IsString()
  status!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conversationData?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mdStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorMessage?: string;
}
