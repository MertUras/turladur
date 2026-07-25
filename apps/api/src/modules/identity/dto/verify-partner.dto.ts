import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyPartnerDto {
  @ApiProperty({ description: 'Email verification token from mail link' })
  @IsString()
  @MinLength(10)
  token!: string;
}
