import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AssignSeatManualDto {
  @ApiProperty({ example: '12' })
  @IsString()
  @MinLength(1)
  seatCode!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  reservationGuestId!: string;
}
