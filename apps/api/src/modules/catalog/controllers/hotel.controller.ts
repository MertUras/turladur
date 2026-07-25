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
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreateHotelDto,
  CreateRoomDto,
  SearchHotelsDto,
  UpdateHotelDto,
  UpdateRoomDto,
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
  @ApiOperation({ summary: 'Hotel detail with available rooms' })
  getById(@Param('id') id: string) {
    return this.hotelService.getById(id);
  }

  @Public()
  @Get(':id/rooms')
  @ApiOperation({ summary: 'List rooms for a hotel' })
  listRooms(@Param('id') id: string) {
    return this.hotelService.listRooms(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create hotel (partner with HOTELS capability)' })
  create(@Body() dto: CreateHotelDto, @CurrentUser() user: UserPayload) {
    return this.hotelService.create(dto, user.partnerId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update owned hotel' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.hotelService.update(id, dto, user.partnerId, user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete owned hotel' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.hotelService.softDelete(id, user.partnerId, user.role);
  }

  @Post(':id/rooms')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add room to hotel' })
  createRoom(
    @Param('id') id: string,
    @Body() dto: CreateRoomDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.hotelService.createRoom(id, dto, user.partnerId, user.role);
  }

  @Patch(':id/rooms/:roomId')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update room' })
  updateRoom(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
    @Body() dto: UpdateRoomDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.hotelService.updateRoom(
      id,
      roomId,
      dto,
      user.partnerId,
      user.role,
    );
  }

  @Delete(':id/rooms/:roomId')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete room' })
  removeRoom(
    @Param('id') id: string,
    @Param('roomId') roomId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.hotelService.softDeleteRoom(
      id,
      roomId,
      user.partnerId,
      user.role,
    );
  }
}
