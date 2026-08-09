import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchRoutesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    enum: ['historical', 'nature', 'beach', 'gastronomy', 'family'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['historical', 'nature', 'beach', 'gastronomy', 'family'])
  category?: string;

  @ApiPropertyOptional({
    enum: ['1-day', '2-3-days', '4-7-days', '7-plus-days'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['1-day', '2-3-days', '4-7-days', '7-plus-days'])
  duration?: string;

  @ApiPropertyOptional({
    enum: ['spring', 'summer', 'autumn', 'winter'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['spring', 'summer', 'autumn', 'winter'])
  season?: string;
}
