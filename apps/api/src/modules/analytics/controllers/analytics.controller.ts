import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { AnalyticsService } from '../services/analytics.service';

class PopularSearchesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin/overview')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Platform metrics for admin dashboard' })
  adminOverview() {
    return this.analyticsService.getAdminOverview();
  }

  @Get('admin/popular-searches')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Top search queries (last 30 days)' })
  popularSearches(@Query() query: PopularSearchesQueryDto) {
    return this.analyticsService.getPopularSearches(query.limit ?? 10);
  }

  @Get('partner/overview')
  @Roles(Role.PARTNER, Role.PARTNER_STAFF)
  @ApiOperation({ summary: 'Partner dashboard metrics' })
  partnerOverview(@CurrentUser() user: UserPayload) {
    return this.analyticsService.getPartnerOverview(user.partnerId);
  }
}
