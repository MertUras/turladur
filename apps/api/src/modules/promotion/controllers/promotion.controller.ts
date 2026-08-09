import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';

import { PLATFORM_ADMIN_ROLES } from '../../../core/auth/utils/role-access';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreateCampaignDto,
  CreateCouponDto,
  ValidateCouponDto,
} from '../dto/promotion.dto';
import { CampaignService } from '../services/campaign.service';
import { CouponService } from '../services/coupon.service';

@ApiTags('Promotion')
@Controller('promotion')
export class PromotionController {
  constructor(
    private readonly couponService: CouponService,
    private readonly campaignService: CampaignService,
  ) {}

  @Public()
  @Get('campaigns')
  @ApiOperation({ summary: 'List active campaigns' })
  listCampaigns() {
    return this.campaignService.listActive();
  }

  @Public()
  @Get('campaigns/:slug')
  @ApiOperation({ summary: 'Get campaign by slug' })
  getCampaign(@Param('slug') slug: string) {
    return this.campaignService.getBySlug(slug);
  }

  @Post('campaigns')
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Create campaign' })
  createCampaign(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Post('coupons')
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Create coupon' })
  createCoupon(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Post('coupons/validate')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Validate coupon for current user' })
  validate(@Body() dto: ValidateCouponDto, @CurrentUser() user: UserPayload) {
    return this.couponService.validate(dto.code, user.userId);
  }

  @Post('coupons/redeem')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Redeem coupon (optional reservationId)' })
  redeem(@Body() dto: ValidateCouponDto, @CurrentUser() user: UserPayload) {
    return this.couponService.redeem(dto.code, user.userId, dto.reservationId);
  }

  @Get('coupons')
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'List active coupons (admin)' })
  listCoupons() {
    return this.couponService.listActive();
  }
}
