import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { CreateCampaignDto } from '../dto/promotion.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCampaignDto) {
    const row = await this.prisma.campaign.create({
      data: {
        title: dto.title.trim(),
        slug: dto.slug.trim().toLowerCase(),
        bannerUrl: dto.bannerUrl,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        isActive: dto.isActive ?? true,
      },
    });
    return { success: true, data: row, error: null };
  }

  async listActive() {
    const now = new Date();
    const rows = await this.prisma.campaign.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: rows, error: null };
  }

  async getBySlug(slug: string) {
    const row = await this.prisma.campaign.findFirst({
      where: { slug, deletedAt: null, isActive: true },
    });
    if (!row) {
      throw new NotFoundException({
        code: 'CAMPAIGN_NOT_FOUND',
        message: 'Kampanya bulunamadı',
      });
    }
    return { success: true, data: row, error: null };
  }
}
