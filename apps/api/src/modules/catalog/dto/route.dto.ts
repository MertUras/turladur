import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchRoutesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    enum: ['historical', 'nature', 'beach', 'gastronomy', 'family'],
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: ['1-day', '2-3-days', '4-7-days', '7-plus-days'],
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({
    enum: ['spring', 'summer', 'autumn', 'winter'],
  })
  @IsOptional()
  @IsString()
  season?: string;
}
