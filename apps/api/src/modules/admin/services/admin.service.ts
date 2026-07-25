import { Injectable, NotFoundException } from '@nestjs/common';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import {
  CreatePostDto,
  SearchPostsDto,
  UpdatePostDto,
} from '../../content/dto/content.dto';
import { ContentService } from '../../content/services/content.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly contentService: ContentService,
  ) {}

  async getDashboardStats() {
    const [
      users,
      partners,
      partnersPending,
      tours,
      toursPending,
      experiences,
      experiencesPending,
      reservations,
      paymentsSuccess,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.partner.count({ where: { deletedAt: null } }),
      this.prisma.partner.count({
        where: { deletedAt: null, status: 'PENDING' },
      }),
      this.prisma.tour.count({ where: { deletedAt: null } }),
      this.prisma.tour.count({
        where: { deletedAt: null, status: 'PENDING_REVIEW' },
      }),
      this.prisma.experience.count({ where: { deletedAt: null } }),
      this.prisma.experience.count({
        where: { deletedAt: null, status: 'PENDING_REVIEW' },
      }),
      this.prisma.reservation.count({ where: { deletedAt: null } }),
      this.prisma.paymentTransaction.count({ where: { status: 'SUCCESS' } }),
    ]);

    return {
      success: true,
      data: {
        users,
        partners: { total: partners, pending: partnersPending },
        tours: { total: tours, pendingReview: toursPending },
        experiences: { total: experiences, pendingReview: experiencesPending },
        reservations,
        paymentsSuccess,
      },
      error: null,
    };
  }

  async listUsers() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        partnerId: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async updateUser(
    userId: string,
    input: { isActive?: boolean; role?: string },
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Kullanıcı bulunamadı',
      });
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        ...(input.role
          ? {
              role: input.role as
                | 'CUSTOMER'
                | 'PARTNER'
                | 'PARTNER_STAFF'
                | 'ADMIN'
                | 'SUPER_ADMIN',
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return { success: true, data: updated, error: null };
  }

  async listPartners(status?: string) {
    const partners = await this.prisma.partner.findMany({
      where: {
        deletedAt: null,
        ...(status
          ? {
              status: status as
                'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true,
      data: partners.map((p) => ({
        id: p.id,
        companyName: p.companyName,
        contactEmail: p.contactEmail,
        contactPhone: p.contactPhone,
        status: p.status,
        verifiedAt: p.verifiedAt?.toISOString() ?? null,
        createdAt: p.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async setPartnerStatus(
    partnerId: string,
    status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
  ) {
    const partner = await this.prisma.partner.findFirst({
      where: { id: partnerId, deletedAt: null },
    });
    if (!partner) {
      throw new NotFoundException({
        code: 'PARTNER_NOT_FOUND',
        message: 'Partner bulunamadı',
      });
    }

    const updated = await this.prisma.partner.update({
      where: { id: partnerId },
      data: {
        status,
        verifiedAt: status === 'VERIFIED' ? new Date() : partner.verifiedAt,
        verificationToken:
          status === 'VERIFIED' ? null : partner.verificationToken,
      },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        companyName: updated.companyName,
        status: updated.status,
        verifiedAt: updated.verifiedAt?.toISOString() ?? null,
      },
      error: null,
    };
  }

  async listPendingTours() {
    const tours = await this.prisma.tour.findMany({
      where: { deletedAt: null, status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true,
      data: tours.map((t) => ({
        id: t.id,
        title: t.title,
        partnerId: t.partnerId,
        price: t.price.toString(),
        currency: t.currency,
        category: t.category,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async listPendingExperiences() {
    const rows = await this.prisma.experience.findMany({
      where: { deletedAt: null, status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true,
      data: rows.map((e) => ({
        id: e.id,
        title: e.title,
        partnerId: e.partnerId,
        price: e.price.toString(),
        currency: e.currency,
        category: e.category,
        location: e.location,
        status: e.status,
        createdAt: e.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async setExperienceStatus(
    experienceId: string,
    status: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT',
  ) {
    const experience = await this.prisma.experience.findFirst({
      where: { id: experienceId, deletedAt: null },
    });
    if (!experience) {
      throw new NotFoundException({
        code: 'EXPERIENCE_NOT_FOUND',
        message: 'Deneyim bulunamadı',
      });
    }

    const updated = await this.prisma.experience.update({
      where: { id: experienceId },
      data: { status },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        status: updated.status,
      },
      error: null,
    };
  }

  async setTourStatus(
    tourId: string,
    status: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT',
  ) {
    const tour = await this.prisma.tour.findFirst({
      where: { id: tourId, deletedAt: null },
    });
    if (!tour) {
      throw new NotFoundException({
        code: 'TOUR_NOT_FOUND',
        message: 'Tur bulunamadı',
      });
    }

    if (
      status === 'PUBLISHED' &&
      tour.status !== 'PENDING_REVIEW' &&
      tour.status !== 'DRAFT' &&
      tour.status !== 'ARCHIVED'
    ) {
      throw new BusinessException(
        'INVALID_STATUS_TRANSITION',
        'Tur yayına alınamaz',
      );
    }

    const updated = await this.prisma.tour.update({
      where: { id: tourId },
      data: { status },
    });

    await this.cache.invalidatePattern('catalog:tours:search:*');
    await this.cache.del(`catalog:tour:${tourId}`);

    return {
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        status: updated.status,
      },
      error: null,
    };
  }

  async listAgencies(status?: string) {
    const agencies = await this.prisma.agency.findMany({
      where: {
        deletedAt: null,
        ...(status
          ? {
              status: status as
                'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED',
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true,
      data: agencies.map((a) => ({
        id: a.id,
        name: a.name,
        status: a.status,
        userId: a.userId,
        email: a.email,
        city: a.city,
        createdAt: a.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async setAgencyStatus(
    agencyId: string,
    status: 'APPROVED' | 'REJECTED' | 'SUSPENDED',
  ) {
    const agency = await this.prisma.agency.findFirst({
      where: { id: agencyId, deletedAt: null },
    });
    if (!agency) {
      throw new NotFoundException({
        code: 'AGENCY_NOT_FOUND',
        message: 'Acente bulunamadı',
      });
    }

    const updated = await this.prisma.agency.update({
      where: { id: agency.id },
      data: { status },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        status: updated.status,
      },
      error: null,
    };
  }

  async listContentPosts(dto: SearchPostsDto) {
    return this.contentService.searchPosts(
      { ...dto, includeDrafts: true },
      true,
    );
  }

  async createContentPost(dto: CreatePostDto, authorId: string) {
    return this.contentService.createPost(dto, authorId);
  }

  async updateContentPost(
    postId: string,
    dto: UpdatePostDto,
    user: { userId: string; role: string },
  ) {
    return this.contentService.updatePost(postId, dto, user);
  }

  async deleteContentPost(
    postId: string,
    user: { userId: string; role: string },
  ) {
    return this.contentService.softDeletePost(postId, user);
  }

  async listReservations() {
    const rows = await this.prisma.reservation.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const tourIds = [
      ...new Set(rows.map((row) => row.tourId).filter(Boolean)),
    ] as string[];
    const experienceIds = [
      ...new Set(rows.map((row) => row.experienceId).filter(Boolean)),
    ] as string[];
    const partnerIds = [...new Set(rows.map((row) => row.partnerId))];

    const [tours, experiences, partners] = await Promise.all([
      tourIds.length
        ? this.prisma.tour.findMany({
            where: { id: { in: tourIds } },
            select: { id: true, title: true },
          })
        : [],
      experienceIds.length
        ? this.prisma.experience.findMany({
            where: { id: { in: experienceIds } },
            select: { id: true, title: true },
          })
        : [],
      partnerIds.length
        ? this.prisma.partner.findMany({
            where: { id: { in: partnerIds } },
            select: { id: true, companyName: true },
          })
        : [],
    ]);

    const tourTitleById = new Map(tours.map((t) => [t.id, t.title]));
    const experienceTitleById = new Map(
      experiences.map((e) => [e.id, e.title]),
    );
    const partnerNameById = new Map(partners.map((p) => [p.id, p.companyName]));

    return {
      success: true,
      data: rows.map((row) => {
        const guests = Array.isArray(row.guests)
          ? (row.guests as Array<{ firstName?: string; lastName?: string }>)
          : [];
        const primary = guests[0];
        const customerName = primary
          ? `${primary.firstName ?? ''} ${primary.lastName ?? ''}`.trim()
          : row.contactEmail;

        return {
          id: row.id,
          bookingNumber: row.bookingNumber,
          customerName,
          contactEmail: row.contactEmail,
          tourTitle: row.tourId
            ? (tourTitleById.get(row.tourId) ?? null)
            : row.experienceId
              ? (experienceTitleById.get(row.experienceId) ?? null)
              : null,
          partnerName: partnerNameById.get(row.partnerId) ?? null,
          partnerId: row.partnerId,
          status: row.status,
          paymentStatus: row.paymentStatus,
          guestCount: row.adults + row.children,
          totalAmount: row.totalAmount.toString(),
          currency: row.currency,
          startDate: row.startDate?.toISOString() ?? null,
          endDate: row.endDate?.toISOString() ?? null,
          createdAt: row.createdAt.toISOString(),
        };
      }),
      error: null,
    };
  }
}
