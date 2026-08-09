import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusLayoutKind, Prisma } from '../../../generated/prisma';
import { isPlatformAdminRole } from '../../../core/auth/utils/role-access';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import {
  buildSystemBusLayoutDefs,
  type BusLayoutJson,
  sellableSeatCodes,
} from '../../../shared/utils/bus-seat-layout';

@Injectable()
export class BusSeatLayoutService {
  constructor(private readonly prisma: PrismaService) {}

  /** Idempotent sistem seed (5 kind). */
  async ensureSystemLayouts() {
    const defs = buildSystemBusLayoutDefs();
    const results = [];
    for (const def of defs) {
      const row = await this.prisma.busSeatLayout.upsert({
        where: { kind: def.kind },
        update: {
          name: def.name,
          passengerSeats: def.passengerSeats,
          crewSeats: def.crewSeats,
          rows: def.rows,
          cols: def.cols,
          layoutJson: def.layoutJson as unknown as Prisma.InputJsonValue,
          isSystem: true,
          deletedAt: null,
        },
        create: {
          kind: def.kind,
          name: def.name,
          passengerSeats: def.passengerSeats,
          crewSeats: def.crewSeats,
          rows: def.rows,
          cols: def.cols,
          layoutJson: def.layoutJson as unknown as Prisma.InputJsonValue,
          isSystem: true,
        },
      });
      results.push(row);
    }
    return { success: true, data: results, error: null };
  }

  async listSystemLayouts() {
    const rows = await this.prisma.busSeatLayout.findMany({
      where: { isSystem: true, deletedAt: null },
      orderBy: { passengerSeats: 'asc' },
    });
    return { success: true, data: rows, error: null };
  }

  async getByKind(kind: BusLayoutKind) {
    const row = await this.prisma.busSeatLayout.findFirst({
      where: { kind, deletedAt: null },
    });
    if (!row) {
      throw new NotFoundException({
        code: 'BUS_SEAT_LAYOUT_NOT_FOUND',
        message: 'Koltuk planı bulunamadı',
      });
    }
    return { success: true, data: row, error: null };
  }

  /**
   * TourDate’e kind bağla → capacity / remainingCapacity = passengerSeats
   * (satış yoksa). Satış varsa capacity düşürülemez.
   */
  async setTourDateLayout(
    tourDateId: string,
    kind: BusLayoutKind,
    agencyId: string | undefined,
    role: string,
  ) {
    const tourDate = await this.prisma.tourDate.findFirst({
      where: { id: tourDateId, deletedAt: null },
      include: {
        tour: { select: { agencyId: true, deletedAt: true } },
      },
    });

    if (!tourDate || tourDate.tour.deletedAt) {
      throw new NotFoundException({
        code: 'TOUR_DATE_NOT_FOUND',
        message: 'Tur tarihi bulunamadı',
      });
    }

    const isAdmin = isPlatformAdminRole(role);
    if (!isAdmin && tourDate.tour.agencyId !== agencyId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu tura erişim yetkiniz yok',
      });
    }

    let layout = await this.prisma.busSeatLayout.findFirst({
      where: { kind, isSystem: true, deletedAt: null },
    });
    if (!layout) {
      await this.ensureSystemLayouts();
      layout = await this.prisma.busSeatLayout.findFirst({
        where: { kind, isSystem: true, deletedAt: null },
      });
    }
    if (!layout) {
      throw new NotFoundException({
        code: 'BUS_SEAT_LAYOUT_NOT_FOUND',
        message: 'Koltuk planı bulunamadı',
      });
    }

    const soldCount = tourDate.capacity - tourDate.remainingCapacity;
    if (soldCount > layout.passengerSeats) {
      throw new BusinessException(
        'LAYOUT_CAPACITY_TOO_SMALL',
        `Satılmış ${soldCount} kişi; ${layout.passengerSeats} koltuklu plana geçilemez`,
      );
    }

    const activeSeats = await this.prisma.seatAssignment.count({
      where: { tourDateId, deletedAt: null },
    });
    if (activeSeats > layout.passengerSeats) {
      throw new BusinessException(
        'LAYOUT_SEATS_OVERFLOW',
        'Mevcut koltuk atamaları yeni plandan fazla',
      );
    }

    const updated = await this.prisma.tourDate.update({
      where: { id: tourDateId },
      data: {
        busSeatLayoutId: layout.id,
        capacity: layout.passengerSeats,
        remainingCapacity: layout.passengerSeats - soldCount,
      },
    });

    return {
      success: true,
      data: { tourDate: updated, layout },
      error: null,
    };
  }

  parseLayoutJson(raw: unknown): BusLayoutJson {
    return raw as BusLayoutJson;
  }

  seatCodesForLayout(raw: unknown): string[] {
    return sellableSeatCodes(this.parseLayoutJson(raw));
  }
}
