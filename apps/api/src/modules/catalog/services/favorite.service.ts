import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const rows = await this.prisma.favorite.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return { success: true, data: rows, error: null };
  }

  async add(userId: string, dto: { tourId?: string; experienceId?: string }) {
    const tourId = dto.tourId?.trim() || null;
    const experienceId = dto.experienceId?.trim() || null;

    if ((tourId && experienceId) || (!tourId && !experienceId)) {
      throw new BusinessException(
        'FAVORITE_TARGET_XOR',
        'tourId veya experienceId tekil zorunlu',
      );
    }

    if (tourId) {
      const tour = await this.prisma.tour.findFirst({
        where: { id: tourId, deletedAt: null },
      });
      if (!tour) {
        throw new NotFoundException({
          code: 'TOUR_NOT_FOUND',
          message: 'Tur bulunamadı',
        });
      }
    }

    if (experienceId) {
      const experience = await this.prisma.experience.findFirst({
        where: { id: experienceId, deletedAt: null },
      });
      if (!experience) {
        throw new NotFoundException({
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Deneyim bulunamadı',
        });
      }
    }

    const existing = await this.prisma.favorite.findFirst({
      where: {
        userId,
        deletedAt: null,
        ...(tourId ? { tourId } : { experienceId }),
      },
    });
    if (existing) {
      return { success: true, data: existing, error: null };
    }

    const row = await this.prisma.favorite.create({
      data: { userId, tourId, experienceId },
    });
    return { success: true, data: row, error: null };
  }

  async remove(favoriteId: string, userId: string) {
    const row = await this.prisma.favorite.findFirst({
      where: { id: favoriteId, deletedAt: null },
    });
    if (!row) {
      throw new NotFoundException({
        code: 'FAVORITE_NOT_FOUND',
        message: 'Favori bulunamadı',
      });
    }
    if (row.userId !== userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu favoriyi silemezsiniz',
      });
    }

    const updated = await this.prisma.favorite.update({
      where: { id: favoriteId },
      data: { deletedAt: new Date(), deletedBy: userId },
    });
    return { success: true, data: updated, error: null };
  }
}
