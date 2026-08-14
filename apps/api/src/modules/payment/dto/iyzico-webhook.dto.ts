import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class IyzicoWebhookDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  conversationId!: string;

  @ApiProperty({ example: 'SUCCESS' })
  @IsString()
  status!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorMessage?: string;
}
