import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BusLayoutKind } from '../../../generated/prisma';

export class SetTourDateBusLayoutDto {
  @ApiProperty({ enum: BusLayoutKind })
  @IsEnum(BusLayoutKind)
  kind!: BusLayoutKind;
}
