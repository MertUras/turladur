import { Module } from '@nestjs/common';

import { PromotionController } from './controllers/promotion.controller';
import { CampaignService } from './services/campaign.service';
import { CouponService } from './services/coupon.service';

@Module({
  controllers: [PromotionController],
  providers: [CouponService, CampaignService],
  exports: [CouponService, CampaignService],
})
export class PromotionModule {}
