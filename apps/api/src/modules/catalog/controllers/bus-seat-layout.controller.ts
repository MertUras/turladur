import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';

import {
  AGENCY_SELLER_ROLES,
  PLATFORM_ADMIN_ROLES,
} from '../../../core/auth/utils/role-access';
import { BusLayoutKind } from '../../../generated/prisma';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { SetTourDateBusLayoutDto } from '../dto/bus-seat-layout.dto';
import { BusSeatLayoutService } from '../services/bus-seat-layout.service';

@ApiTags('Catalog - Bus Seat Layouts')
@Controller('catalog')
export class BusSeatLayoutController {
  constructor(private readonly layoutService: BusSeatLayoutService) {}

  @Public()
  @Get('bus-seat-layouts')
  @ApiOperation({ summary: 'List system N+1 bus seat layouts' })
  list() {
    return this.layoutService.listSystemLayouts();
  }

  @Public()
  @Get('bus-seat-layouts/:kind')
  @ApiOperation({ summary: 'Get layout by BusLayoutKind' })
  getByKind(@Param('kind') kind: BusLayoutKind) {
    return this.layoutService.getByKind(kind);
  }

  @Post('bus-seat-layouts/seed')
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Upsert 5 system layouts (idempotent)' })
  seed() {
    return this.layoutService.ensureSystemLayouts();
  }

  @Put('tour-dates/:tourDateId/bus-seat-layout')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @ApiOperation({
    summary: 'Bind layout kind to TourDate (capacity = passengerSeats)',
  })
  setTourDateLayout(
    @Param('tourDateId') tourDateId: string,
    @Body() dto: SetTourDateBusLayoutDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.layoutService.setTourDateLayout(
      tourDateId,
      dto.kind,
      user.agencyId,
      user.role,
    );
  }
}
