import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isPlatformAdminRole } from '../../../core/auth/utils/role-access';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import {
  type BusLayoutJson,
  sellableSeatCodes,
} from '../../../shared/utils/bus-seat-layout';

@Injectable()
export class SeatAssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getSeatMap(
    tourDateId: string,
    agencyId: string | undefined,
    role: string,
  ) {
    const tourDate = await this.findOwnedTourDate(tourDateId, agencyId, role);
    if (!tourDate.busSeatLayoutId || !tourDate.busSeatLayout) {
      throw new BusinessException(
        'LAYOUT_REQUIRED',
        'Önce TourDate için bus seat layout seçilmeli',
      );
    }

    await this.ensureReservationGuestsMaterialized(tourDateId);

    const assignments = await this.prisma.seatAssignment.findMany({
      where: { tourDateId, deletedAt: null },
      include: {
        reservationGuest: {
          select: { id: true, fullName: true, identityNumber: true },
        },
        reservation: {
          select: { id: true, bookingNumber: true, status: true },
        },
      },
      orderBy: { assignedAt: 'asc' },
    });

    const byCode = new Map(assignments.map((row) => [row.seatCode, row]));
    const layoutJson = tourDate.busSeatLayout
      .layoutJson as unknown as BusLayoutJson;

    const cells = layoutJson.cells.map((cell) => {
      const assignment = byCode.get(cell.code);
      return {
        ...cell,
        occupancy: assignment
          ? {
              assignmentId: assignment.id,
              guestId: assignment.reservationGuestId,
              fullName: assignment.reservationGuest.fullName,
              bookingNumber: assignment.reservation.bookingNumber,
              source: assignment.source,
            }
          : null,
      };
    });

    const unassignedGuests =
      await this.listUnassignedGuestsInternal(tourDateId);

    return {
      success: true,
      data: {
        tourDateId,
        layout: {
          id: tourDate.busSeatLayout.id,
          kind: tourDate.busSeatLayout.kind,
          passengerSeats: tourDate.busSeatLayout.passengerSeats,
          orientation: layoutJson.orientation,
          legend: layoutJson.legend,
          cells,
        },
        assignments,
        unassignedGuests,
      },
      error: null,
    };
  }

  async assignManual(
    tourDateId: string,
    dto: { seatCode: string; reservationGuestId: string },
    agencyId: string | undefined,
    role: string | null,
  ) {
    const tourDate = await this.findOwnedTourDate(tourDateId, agencyId, role);
    this.assertLayout(tourDate);
    const seatCode = dto.seatCode.trim();
    this.assertSellableSeat(tourDate.busSeatLayout!.layoutJson, seatCode);

    const guest = await this.loadConfirmedGuest(
      dto.reservationGuestId,
      tourDateId,
    );
    await this.assertSeatFree(tourDateId, seatCode);
    await this.assertGuestFree(guest.id);

    const row = await this.prisma.seatAssignment.create({
      data: {
        tourDateId,
        seatCode,
        reservationGuestId: guest.id,
        reservationId: guest.reservationId,
        assignedByAgencyId: agencyId ?? null,
        source: 'MANUAL',
      },
    });

    return { success: true, data: row, error: null };
  }

  async unassign(
    assignmentId: string,
    agencyId: string | undefined,
    role: string,
    deletedBy?: string,
  ) {
    const assignment = await this.prisma.seatAssignment.findFirst({
      where: { id: assignmentId, deletedAt: null },
      include: {
        tourDate: {
          include: { tour: { select: { agencyId: true, deletedAt: true } } },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException({
        code: 'SEAT_ASSIGNMENT_NOT_FOUND',
        message: 'Koltuk ataması bulunamadı',
      });
    }

    this.assertTourOwnership(
      assignment.tourDate.tour.agencyId,
      agencyId,
      role,
      assignment.tourDate.tour.deletedAt,
    );

    const updated = await this.prisma.seatAssignment.update({
      where: { id: assignmentId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { deletedBy } : {}),
      },
    });

    return { success: true, data: updated, error: null };
  }

  /**
   * Onaylı misafirleri alış sırasıyla (reservation.createdAt, guest.sortOrder)
   * boş koltuklara 1…N yerleştir.
   */
  async autoFifo(
    tourDateId: string,
    agencyId: string | undefined,
    role: string | null,
  ) {
    const tourDate = await this.findOwnedTourDate(tourDateId, agencyId, role);
    this.assertLayout(tourDate);
    await this.ensureReservationGuestsMaterialized(tourDateId);

    const codes = sellableSeatCodes(
      tourDate.busSeatLayout!.layoutJson as unknown as BusLayoutJson,
    );
    const occupied = await this.prisma.seatAssignment.findMany({
      where: { tourDateId, deletedAt: null },
      select: { seatCode: true, reservationGuestId: true },
    });
    const takenSeats = new Set(occupied.map((row) => row.seatCode));
    const seatedGuests = new Set(occupied.map((row) => row.reservationGuestId));
    const freeSeats = codes.filter((code) => !takenSeats.has(code));

    const guests = await this.listUnassignedGuestsInternal(tourDateId);
    const queue = guests.filter((guest) => !seatedGuests.has(guest.id));

    const created: Awaited<
      ReturnType<typeof this.prisma.seatAssignment.create>
    >[] = [];
    const limit = Math.min(freeSeats.length, queue.length);

    await this.prisma.$transaction(async (tx) => {
      for (let index = 0; index < limit; index++) {
        const seatCode = freeSeats[index];
        const guest = queue[index];
        const row = await tx.seatAssignment.create({
          data: {
            tourDateId,
            seatCode,
            reservationGuestId: guest.id,
            reservationId: guest.reservationId,
            assignedByAgencyId: agencyId ?? null,
            source: 'AUTO_FIFO',
          },
        });
        created.push(row);
      }
    });

    return {
      success: true,
      data: {
        assignedCount: created.length,
        remainingUnassigned: queue.length - created.length,
        remainingFreeSeats: freeSeats.length - created.length,
        assignments: created,
      },
      error: null,
    };
  }

  /**
   * Legacy rezervasyonlarda guests JSON var, ReservationGuest satırı yok.
   * SeatAssignment FK için eksik satırları bir kez materialize eder.
   */
  private async ensureReservationGuestsMaterialized(tourDateId: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        tourDateId,
        deletedAt: null,
        status: 'CONFIRMED',
      },
      select: {
        id: true,
        guests: true,
        reservationGuests: {
          where: { deletedAt: null },
          select: { id: true },
        },
      },
    });

    for (const reservation of reservations) {
      if (reservation.reservationGuests.length > 0) continue;
      if (
        !Array.isArray(reservation.guests) ||
        reservation.guests.length === 0
      ) {
        continue;
      }

      const rows: Array<{
        reservationId: string;
        fullName: string;
        identityNumber: string;
        sortOrder: number;
      }> = [];

      reservation.guests.forEach((raw, index) => {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
        const guest = raw as Record<string, unknown>;
        const firstName =
          typeof guest.firstName === 'string' ? guest.firstName.trim() : '';
        const lastName =
          typeof guest.lastName === 'string' ? guest.lastName.trim() : '';
        const fullName =
          `${firstName} ${lastName}`.trim() ||
          (typeof guest.fullName === 'string' ? guest.fullName.trim() : '') ||
          `Misafir ${index + 1}`;
        const identityNumber =
          typeof guest.identityNumber === 'string' &&
          guest.identityNumber.trim().length > 0
            ? guest.identityNumber.trim()
            : `LEGACY-${reservation.id.slice(-6)}-${index + 1}`;
        rows.push({
          reservationId: reservation.id,
          fullName,
          identityNumber,
          sortOrder: index,
        });
      });

      if (rows.length > 0) {
        await this.prisma.reservationGuest.createMany({ data: rows });
      }
    }
  }

  private async listUnassignedGuestsInternal(tourDateId: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        tourDateId,
        deletedAt: null,
        status: 'CONFIRMED',
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        bookingNumber: true,
        createdAt: true,
        reservationGuests: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            fullName: true,
            identityNumber: true,
            sortOrder: true,
            reservationId: true,
            seatAssignments: {
              where: { deletedAt: null },
              select: { id: true },
            },
          },
        },
      },
    });

    const guests = [];
    for (const reservation of reservations) {
      for (const guest of reservation.reservationGuests) {
        if (guest.seatAssignments.length === 0) {
          guests.push({
            id: guest.id,
            fullName: guest.fullName,
            identityNumber: guest.identityNumber,
            sortOrder: guest.sortOrder,
            reservationId: guest.reservationId,
            bookingNumber: reservation.bookingNumber,
            reservationCreatedAt: reservation.createdAt,
          });
        }
      }
    }
    return guests;
  }

  private async loadConfirmedGuest(guestId: string, tourDateId: string) {
    const guest = await this.prisma.reservationGuest.findFirst({
      where: { id: guestId, deletedAt: null },
      include: {
        reservation: {
          select: {
            id: true,
            tourDateId: true,
            status: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!guest || guest.reservation.deletedAt) {
      throw new NotFoundException({
        code: 'GUEST_NOT_FOUND',
        message: 'Misafir bulunamadı',
      });
    }

    if (guest.reservation.tourDateId !== tourDateId) {
      throw new BusinessException(
        'GUEST_WRONG_TOUR_DATE',
        'Misafir bu tur tarihine ait değil',
      );
    }

    if (guest.reservation.status !== 'CONFIRMED') {
      throw new BusinessException(
        'RESERVATION_NOT_CONFIRMED',
        'Yalnızca onaylı rezervasyon misafirlerine koltuk atanır',
      );
    }

    return guest;
  }

  private assertLayout(tourDate: {
    busSeatLayoutId: string | null;
    busSeatLayout: { layoutJson: unknown } | null;
  }) {
    if (!tourDate.busSeatLayoutId || !tourDate.busSeatLayout) {
      throw new BusinessException(
        'LAYOUT_REQUIRED',
        'Önce TourDate için bus seat layout seçilmeli',
      );
    }
  }

  private assertSellableSeat(layoutJson: unknown, seatCode: string) {
    const codes = sellableSeatCodes(layoutJson as BusLayoutJson);
    if (!codes.includes(seatCode)) {
      throw new BusinessException(
        'INVALID_SEAT_CODE',
        'Geçersiz veya satılamaz koltuk kodu (CREW atanamaz)',
      );
    }
  }

  private async assertSeatFree(tourDateId: string, seatCode: string) {
    const existing = await this.prisma.seatAssignment.findFirst({
      where: { tourDateId, seatCode, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException('SEAT_OCCUPIED', 'Koltuk dolu');
    }
  }

  private async assertGuestFree(reservationGuestId: string) {
    const existing = await this.prisma.seatAssignment.findFirst({
      where: { reservationGuestId, deletedAt: null },
    });
    if (existing) {
      throw new BusinessException(
        'GUEST_ALREADY_SEATED',
        'Misafirin zaten koltuğu var',
      );
    }
  }

  private async findOwnedTourDate(
    tourDateId: string,
    agencyId: string | undefined,
    role: string | null,
  ) {
    const tourDate = await this.prisma.tourDate.findFirst({
      where: { id: tourDateId, deletedAt: null },
      include: {
        tour: { select: { agencyId: true, deletedAt: true } },
        busSeatLayout: true,
      },
    });

    if (!tourDate || tourDate.tour.deletedAt) {
      throw new NotFoundException({
        code: 'TOUR_DATE_NOT_FOUND',
        message: 'Tur tarihi bulunamadı',
      });
    }

    this.assertTourOwnership(
      tourDate.tour.agencyId,
      agencyId,
      role,
      tourDate.tour.deletedAt,
    );

    return tourDate;
  }

  private assertTourOwnership(
    tourAgencyId: string,
    agencyId: string | undefined,
    role: string | null,
    tourDeletedAt: Date | null,
  ) {
    if (tourDeletedAt) {
      throw new NotFoundException({
        code: 'TOUR_DATE_NOT_FOUND',
        message: 'Tur tarihi bulunamadı',
      });
    }
    const isAdmin = isPlatformAdminRole(role);
    if (!isAdmin && tourAgencyId !== agencyId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu tura erişim yetkiniz yok',
      });
    }
  }
}
