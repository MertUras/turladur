import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { RequireStaffPermissions } from '../../../core/auth/decorators/require-staff-permissions.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { PartnerService } from '../services/partner.service';

class UpdatePartnerReservationDto {
  @ApiProperty({ enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'] })
  @IsIn(['CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status!: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

class UpdatePartnerProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  contactPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  taxNumber?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string | null;
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
    return this.partnerService.getDashboardStats(user.partnerId, {
      userId: user.userId,
      role: user.role,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated partner profile' })
  me(@CurrentUser() user: UserPayload) {
    return this.partnerService.getProfile(user.partnerId);
  }

  @Patch('me')
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update partner company profile' })
  updateMe(
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdatePartnerProfileDto,
  ) {
    return this.partnerService.updateProfile(user.partnerId, dto);
  }

  @Get('financials')
  @RequireStaffPermissions('reports')
  @ApiOperation({ summary: 'Monthly revenue for partner charts' })
  financials(@CurrentUser() user: UserPayload) {
    return this.partnerService.getFinancials(user.partnerId);
  }

  @Get('reports')
  @RequireStaffPermissions('reports')
  @ApiOperation({ summary: 'Partner sales/performance/customer reports' })
  reports(
    @CurrentUser() user: UserPayload,
    @Query('dateRange') dateRange?: string,
  ) {
    const allowed = [
      'today',
      'yesterday',
      'thisWeek',
      'lastWeek',
      'thisMonth',
      'lastMonth',
      'last3Months',
      'lastYear',
      'custom',
    ] as const;
    const range = allowed.includes(dateRange as (typeof allowed)[number])
      ? (dateRange as (typeof allowed)[number])
      : 'thisMonth';
    return this.partnerService.getReports(user.partnerId, range);
  }

  @Get('tours')
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'List tours owned by partner (all statuses)' })
  tours(@CurrentUser() user: UserPayload) {
    return this.partnerService.listTours(user.partnerId);
  }

  @Get('tours/:id')
  @RequireStaffPermissions('tours')
  @ApiOperation({
    summary: 'Get partner tour detail for editing (all statuses)',
  })
  tourDetail(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.partnerService.getTourDetail(user.partnerId, id);
  }

  @Get('experiences')
  @RequireStaffPermissions('tours')
  @ApiOperation({
    summary: 'List experiences owned by partner (all statuses)',
  })
  experiences(@CurrentUser() user: UserPayload) {
    return this.partnerService.listExperiences(user.partnerId);
  }

  @Get('users')
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'List sub-users for authenticated partner' })
  users(@CurrentUser() user: UserPayload) {
    return this.partnerService.listSubUsers(user.partnerId);
  }

  @Get('reservations')
  @RequireStaffPermissions('reservations', 'customers')
  @ApiOperation({ summary: 'List reservations for partner tours' })
  reservations(@CurrentUser() user: UserPayload) {
    return this.partnerService.listReservations(user.partnerId);
  }

  @Patch('reservations/:id')
  @RequireStaffPermissions('reservations')
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
