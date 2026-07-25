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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { RequireStaffPermissions } from '../../../core/auth/decorators/require-staff-permissions.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { CreateTourDateCommand } from '../commands/create-tour-date/create-tour-date.command';
import { CreateTourCommand } from '../commands/create-tour/create-tour.command';
import { DeleteTourCommand } from '../commands/delete-tour/delete-tour.command';
import { UpdateTourCommand } from '../commands/update-tour/update-tour.command';
import { CancelTourDatesDto } from '../dto/cancel-tour-dates.dto';
import { CancelTourDto } from '../dto/cancel-tour.dto';
import { CreateTourDateDto } from '../dto/create-tour-date.dto';
import { CreateTourDto } from '../dto/create-tour.dto';
import { SearchToursDto } from '../dto/search-tours.dto';
import { UpdateTourDto } from '../dto/update-tour.dto';
import { GetTourQuery } from '../queries/get-tour/get-tour.query';
import { ListTourDatesQuery } from '../queries/list-tour-dates/list-tour-dates.query';
import { SearchToursQuery } from '../queries/search-tours/search-tours.query';
import { TourService } from '../services/tour.service';

@ApiTags('Catalog - Tours')
@Controller('catalog/tours')
export class TourController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly tourService: TourService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get('search')
  @ApiOperation({ summary: 'Search published tours (Redis cached)' })
  search(@Query() dto: SearchToursDto) {
    return this.queryBus.execute(new SearchToursQuery(dto));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get tour detail by id' })
  getById(@Param('id') id: string) {
    return this.queryBus.execute(new GetTourQuery(id));
  }

  @Public()
  @Get(':id/dates')
  @ApiOperation({ summary: 'List active tour dates' })
  listDates(@Param('id') id: string) {
    return this.queryBus.execute(new ListTourDatesQuery(id));
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Create a tour (verified partner)' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateTourDto, @CurrentUser() user: UserPayload) {
    return this.commandBus.execute(new CreateTourCommand(dto, user.partnerId));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Update owned tour' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTourDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.commandBus.execute(
      new UpdateTourCommand(id, dto, user.partnerId, user.role),
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Soft-delete owned tour' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.commandBus.execute(
      new DeleteTourCommand(id, user.partnerId, user.role),
    );
  }

  @Post(':id/cancel')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({
    summary:
      'Cancel / delist tour with reason — cancels active bookings and emails guests',
  })
  cancelTour(
    @Param('id') id: string,
    @Body() dto: CancelTourDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourService.cancelWithReason(
      id,
      user.partnerId,
      user.role,
      dto.reason,
      dto.note,
    );
  }

  @Post(':id/dates/cancel')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({
    summary:
      'Cancel selected tour dates — cancels bookings for those dates and emails guests',
  })
  cancelTourDates(
    @Param('id') id: string,
    @Body() dto: CancelTourDatesDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.tourService.cancelDates(
      id,
      user.partnerId,
      user.role,
      dto.dateIds,
      dto.reason,
      dto.note,
    );
  }

  @Post(':id/dates')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.PARTNER_STAFF, Role.ADMIN, Role.SUPER_ADMIN)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Add a date/capacity window to a tour' })
  createDate(
    @Param('id') id: string,
    @Body() dto: CreateTourDateDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.commandBus.execute(
      new CreateTourDateCommand(id, dto, user.partnerId, user.role),
    );
  }
}
