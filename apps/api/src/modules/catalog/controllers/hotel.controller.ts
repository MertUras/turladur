import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import {
  AGENCY_SELLER_ROLES,
  resolveActorId,
} from '../../../core/auth/utils/role-access';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { RequireStaffPermissions } from '../../../core/auth/decorators/require-staff-permissions.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreateHotelDto,
  SearchHotelsDto,
  UpdateHotelDto,
} from '../dto/hotel.dto';
import { HotelService } from '../services/hotel.service';

@ApiTags('Catalog - Hotels')
@Controller('catalog/hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get()
  @ApiOperation({ summary: 'Search / list hotels' })
  search(@Query() dto: SearchHotelsDto) {
    return this.hotelService.search(dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Hotel detail (reference only, no sales)' })
  getById(@Param('id') id: string) {
    return this.hotelService.getById(id);
  }

  @Public()
  @Get(':id/rooms')
  @ApiOperation({
    summary: 'List rooms for a hotel (deprecated — always empty)',
  })
  listRooms(@Param('id') id: string) {
    return this.hotelService.listRooms(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Create hotel (partner with HOTELS capability)' })
  create(@Body() dto: CreateHotelDto, @CurrentUser() user: UserPayload) {
    return this.hotelService.create(dto, user.agencyId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Update owned hotel' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.hotelService.update(id, dto, user.agencyId, user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Soft-delete owned hotel' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.hotelService.softDelete(
      id,
      user.agencyId,
      user.role,
      resolveActorId(user),
    );
  }
}
