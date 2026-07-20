import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ReplyReviewDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  reply!: string;
}
