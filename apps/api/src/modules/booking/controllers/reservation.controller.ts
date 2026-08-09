import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import {
  AGENCY_SELLER_ROLES,
  PLATFORM_ADMIN_ROLES,
} from '../../../core/auth/utils/role-access';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { CancelReservationCommand } from '../commands/cancel-reservation/cancel-reservation.command';
import { CreateReservationCommand } from '../commands/create-reservation/create-reservation.command';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { GetReservationQuery } from '../queries/get-reservation/get-reservation.query';
import { ListReservationsQuery } from '../queries/list-reservations/list-reservations.query';
import { VoucherService } from '../services/voucher.service';

@ApiTags('Booking - Reservations')
@ApiBearerAuth()
@Controller('booking/reservations')
export class ReservationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly voucherService: VoucherService,
  ) {}

  @Post()
  @Roles(Role.CUSTOMER, ...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Create a reservation (holds capacity)' })
  create(@Body() dto: CreateReservationDto, @CurrentUser() user: UserPayload) {
    return this.commandBus.execute(
      new CreateReservationCommand(dto, user.userId),
    );
  }

  @Get()
  @Roles(Role.CUSTOMER, ...AGENCY_SELLER_ROLES)
  @ApiOperation({ summary: 'List my reservations' })
  list(@CurrentUser() user: UserPayload) {
    return this.queryBus.execute(new ListReservationsQuery(user.userId));
  }

  @Get(':id/voucher')
  @Roles(Role.CUSTOMER, ...AGENCY_SELLER_ROLES)
  @ApiOperation({ summary: 'Get printable voucher HTML for a reservation' })
  voucher(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.voucherService.getVoucherPayload(id, {
      userId: user.userId,
      role: user.role,
      agencyId: user.agencyId,
    });
  }

  @Get(':id')
  @Roles(Role.CUSTOMER, ...AGENCY_SELLER_ROLES)
  @ApiOperation({ summary: 'Get reservation by id' })
  getById(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.queryBus.execute(
      new GetReservationQuery(id, user.userId, user.role, user.agencyId),
    );
  }

  @Patch(':id/cancel')
  @Roles(Role.CUSTOMER, ...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Cancel reservation and restore capacity' })
  cancel(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.commandBus.execute(
      new CancelReservationCommand(id, user.userId, user.role),
    );
  }
}
