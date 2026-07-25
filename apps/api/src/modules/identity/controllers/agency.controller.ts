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
import { Role } from '@turta/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreateAgencyDto,
  SearchAgenciesDto,
  UpdateAgencyDto,
} from '../dto/agency.dto';
import { AgencyService } from '../services/agency.service';

@ApiTags('Identity - Agencies')
@Controller('identity/agencies')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get()
  @ApiOperation({ summary: 'List approved agencies (admin sees all filters)' })
  search(@Query() dto: SearchAgenciesDto, @CurrentUser() user?: UserPayload) {
    return this.agencyService.search(
      dto,
      user ? { userId: user.userId, role: user.role } : undefined,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get agency owned by current user' })
  me(@CurrentUser() user: UserPayload) {
    return this.agencyService.getMine(user.userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Agency detail' })
  getById(@Param('id') id: string, @CurrentUser() user?: UserPayload) {
    return this.agencyService.getById(
      id,
      user ? { userId: user.userId, role: user.role } : undefined,
    );
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Register a new agency (pending approval)' })
  create(@Body() dto: CreateAgencyDto, @CurrentUser() user: UserPayload) {
    return this.agencyService.create(dto, user.userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update owned agency' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAgencyDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.agencyService.update(id, dto, {
      userId: user.userId,
      role: user.role,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete owned agency' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.agencyService.softDelete(id, {
      userId: user.userId,
      role: user.role,
    });
  }
}
