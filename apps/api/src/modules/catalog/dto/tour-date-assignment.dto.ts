import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InviteGuideAssignmentDto {
  @ApiProperty({ description: 'Guide.id' })
  @IsString()
  @MinLength(1)
  guideId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}

export class InviteBusAssignmentDto {
  @ApiProperty({ description: 'BusCompany.id' })
  @IsString()
  @MinLength(1)
  busCompanyId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}

export class RespondAssignmentDto {
  @ApiProperty({ enum: ['ACCEPTED', 'REJECTED'] })
  @IsIn(['ACCEPTED', 'REJECTED'])
  status!: 'ACCEPTED' | 'REJECTED';

  @ApiPropertyOptional({ description: 'BUS ACCEPTED için zorunlu Vehicle.id' })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Red gerekçesi vb.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  /** Guide JWT yokken actor doğrulama (geçici — bulgular A11). */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorGuideId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorBusCompanyId?: string;
}
