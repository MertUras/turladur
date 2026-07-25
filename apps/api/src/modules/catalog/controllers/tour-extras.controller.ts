import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { RequireStaffPermissions } from '../../../core/auth/decorators/require-staff-permissions.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreateTourPickupPointDto,
  UpdateTourPickupPointDto,
  UpsertTourAccommodationDto,
} from '../dto/tour-extras.dto';
import { TourExtrasService } from '../services/tour-extras.service';

@ApiTags('Catalog - Tour Extras')
@Controller('catalog/tours/:tourId')
export class TourExtrasController {
  constructor(private readonly tourExtrasService: TourExtrasService) {}

  @Public()
  @Get('accommodation')
  @ApiOperation({ summary: 'Get tour accommodation summary' })
  getAccommodation(@Param('tourId') tourId: string) {
    return this.tourExtrasService.getAccommodation(tourId);
  }

  @Put('accommodation')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Create or update tour accommodation (1:1)' })
  upsertAccommodation(
    @Param('tourId') tourId: string,
    @Body() dto: UpsertTourAccommodationDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourExtrasService.upsertAccommodation(
      tourId,
      dto,
      user.partnerId,
      user.role,
    );
  }

  @Delete('accommodation')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Soft-delete tour accommodation' })
  deleteAccommodation(
    @Param('tourId') tourId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourExtrasService.deleteAccommodation(
      tourId,
      user.partnerId,
      user.role,
    );
  }

  @Public()
  @Get('pickup-points')
  @ApiOperation({ summary: 'List active pickup points' })
  listPickupPoints(@Param('tourId') tourId: string) {
    return this.tourExtrasService.listPickupPoints(tourId);
  }

  @Post('pickup-points')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Add pickup point' })
  createPickupPoint(
    @Param('tourId') tourId: string,
    @Body() dto: CreateTourPickupPointDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourExtrasService.createPickupPoint(
      tourId,
      dto,
      user.partnerId,
      user.role,
    );
  }

  @Patch('pickup-points/:pointId')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Update pickup point' })
  updatePickupPoint(
    @Param('tourId') tourId: string,
    @Param('pointId') pointId: string,
    @Body() dto: UpdateTourPickupPointDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourExtrasService.updatePickupPoint(
      tourId,
      pointId,
      dto,
      user.partnerId,
      user.role,
    );
  }

  @Delete('pickup-points/:pointId')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Soft-delete pickup point' })
  deletePickupPoint(
    @Param('tourId') tourId: string,
    @Param('pointId') pointId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourExtrasService.deletePickupPoint(
      tourId,
      pointId,
      user.partnerId,
      user.role,
    );
  }
}
