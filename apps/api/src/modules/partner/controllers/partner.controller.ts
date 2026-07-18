import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { PartnerService } from '../services/partner.service';

class UpdatePartnerReservationDto {
  @ApiProperty({ enum: ['CONFIRMED', 'CANCELLED'] })
  @IsIn(['CONFIRMED', 'CANCELLED'])
  status!: 'CONFIRMED' | 'CANCELLED';
}

@ApiTags('Partner')
@ApiBearerAuth()
@Controller('partner')
@Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Partner dashboard statistics' })
  stats(@CurrentUser() user: UserPayload) {
    return this.partnerService.getDashboardStats(user.partnerId);
  }

  @Get('tours')
  @ApiOperation({ summary: 'List tours owned by partner (all statuses)' })
  tours(@CurrentUser() user: UserPayload) {
    return this.partnerService.listTours(user.partnerId);
  }

  @Get('reservations')
  @ApiOperation({ summary: 'List reservations for partner tours' })
  reservations(@CurrentUser() user: UserPayload) {
    return this.partnerService.listReservations(user.partnerId);
  }

  @Patch('reservations/:id')
  @ApiOperation({ summary: 'Confirm or cancel a partner reservation' })
  updateReservation(
    @Param('id') id: string,
    @Body() dto: UpdatePartnerReservationDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.partnerService.updateReservationStatus(
      id,
      user.partnerId,
      dto.status,
    );
  }
}
