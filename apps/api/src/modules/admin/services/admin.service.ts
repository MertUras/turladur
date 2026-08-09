import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CacheService } from '../../../core/cache/cache.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { EmailQueueService } from '../../../core/queue/email-queue.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { PartnerVerifiedEvent } from '../../identity/events/partner-verified.event';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly emailQueue: EmailQueueService,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
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
      this.prisma.agency.count({ where: { deletedAt: null } }),
      this.prisma.agency.count({
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
    const partners = await this.prisma.agency.findMany({
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
    agencyId: string,
    status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
  ) {
    const partner = await this.prisma.agency.findFirst({
      where: { id: agencyId, deletedAt: null },
    });
    if (!partner) {
      throw new NotFoundException({
        code: 'PARTNER_NOT_FOUND',
        message: 'Partner bulunamadı',
      });
    }

    const wasVerified = partner.status === 'VERIFIED';
    const updated = await this.prisma.agency.update({
      where: { id: agencyId },
      data: {
        status,
        verifiedAt: status === 'VERIFIED' ? new Date() : partner.verifiedAt,
      },
    });

    if (status === 'VERIFIED' && !wasVerified) {
      // Consumer: DomainAuditListener; partner-approved e-posta burada
      this.eventEmitter.emit(
        'partner.verified',
        new PartnerVerifiedEvent(updated.id, updated.contactEmail),
      );

      const webBase = (
        this.config.get<string>('EMAIL_BRAND_URL') ??
        this.config.get<string>('FRONTEND_URL') ??
        'https://turladur-zjyf.vercel.app'
      )
        .split(',')[0]
        .trim()
        .replace(/\/$/, '');

      await this.emailQueue.enqueue({
        to: updated.contactEmail,
        template: 'partner-approved',
        data: {
          companyName: updated.companyName,
          loginUrl: `${webBase}/partner-login`,
        },
      });
    }

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

  async listGuides(status?: string) {
    const guides = await this.prisma.guide.findMany({
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
      data: guides.map((guide) => ({
        id: guide.id,
        firstName: guide.firstName,
        lastName: guide.lastName,
        email: guide.email,
        identityNumber: guide.identityNumber,
        phone: guide.phone,
        city: guide.city,
        languages: guide.languages,
        oda: guide.oda,
        sicilNo: guide.sicilNo,
        ruhsatNo: guide.ruhsatNo,
        ruhsatExpiresAt:
          guide.ruhsatExpiresAt?.toISOString().slice(0, 10) ?? null,
        birthDate: guide.birthDate?.toISOString().slice(0, 10) ?? null,
        status: guide.status,
        verifiedAt: guide.verifiedAt?.toISOString() ?? null,
        createdAt: guide.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async setGuideStatus(
    guideId: string,
    status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
  ) {
    const guide = await this.prisma.guide.findFirst({
      where: { id: guideId, deletedAt: null },
    });
    if (!guide) {
      throw new NotFoundException({
        code: 'GUIDE_NOT_FOUND',
        message: 'Rehber bulunamadı',
      });
    }

    const updated = await this.prisma.guide.update({
      where: { id: guideId },
      data: {
        status,
        verifiedAt: status === 'VERIFIED' ? new Date() : guide.verifiedAt,
      },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
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
        agencyId: t.agencyId,
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
        agencyId: e.agencyId,
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

    if (status === 'PUBLISHED') {
      if (tour.agencyId) {
        const agency = await this.prisma.agency.findFirst({
          where: { id: tour.agencyId, deletedAt: null },
        });
        if (
          !agency?.taxNumber?.trim() ||
          !agency.legalTitle?.trim() ||
          !agency.address?.trim()
        ) {
          throw new BusinessException(
            'AGENCY_INVOICE_FIELDS_REQUIRED',
            'Tur yayınlamak için acente VKN, unvan ve adres zorunludur',
          );
        }
      } else {
        const partner = await this.prisma.agency.findFirst({
          where: { id: tour.agencyId, deletedAt: null },
        });
        if (!partner?.taxNumber?.trim() || !partner.address?.trim()) {
          throw new BusinessException(
            'AGENCY_INVOICE_FIELDS_REQUIRED',
            'Tur yayınlamak için satıcı VKN ve adres zorunludur',
          );
        }
      }
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
                'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
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
        name: a.companyName,
        status: a.status,
        userId: null,
        email: a.contactEmail,
        city: a.city,
        createdAt: a.createdAt.toISOString(),
      })),
      error: null,
    };
  }

  async setAgencyStatus(
    agencyId: string,
    status: 'VERIFIED' | 'REJECTED' | 'SUSPENDED',
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
      data: {
        status,
        verifiedAt: status === 'VERIFIED' ? new Date() : agency.verifiedAt,
      },
    });

    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.companyName,
        status: updated.status,
      },
      error: null,
    };
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
    const partnerIds = [...new Set(rows.map((row) => row.agencyId))];

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
        ? this.prisma.agency.findMany({
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
          partnerName: partnerNameById.get(row.agencyId) ?? null,
          agencyId: row.agencyId,
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
