import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusLayoutKind } from '../../../generated/prisma';
import { BusinessException } from '../../../shared/exceptions/business.exception';

export type AvailabilityDay = {
  date: string;
  isAvailable: boolean;
  locked: boolean;
  lockReason: 'ASSIGNMENT' | null;
};

function parseDay(isoDate: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    throw new BusinessException('INVALID_DATE', 'Tarih YYYY-MM-DD olmalı');
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function eachDay(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(from);
  while (cursor.getTime() <= to.getTime()) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
}

function dayKey(date: Date): string {
  return formatDay(date);
}

/**
 * GuideAvailability / VehicleAvailability CRUD — DATABASE_SCHEMA day rows.
 * Missing row = available (default). Assignment ACCEPTED days are locked.
 */
@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Agency read model: VERIFIED guides + whether every day in [from,to] is free.
   * Missing GuideAvailability row = available (DATABASE_SCHEMA).
   */
  async listGuidesForRange(
    fromIso: string,
    toIso: string,
    options?: { q?: string; availableOnly?: boolean },
  ) {
    const from = parseDay(fromIso);
    const to = parseDay(toIso);
    this.assertRange(from, to);
    const days = eachDay(from, to);
    const search = options?.q?.trim();

    const guides = await this.prisma.guide.findMany({
      where: {
        deletedAt: null,
        status: 'VERIFIED',
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        identityNumber: true,
        city: true,
        languages: true,
        oda: true,
        sicilNo: true,
        ruhsatNo: true,
        ruhsatExpiresAt: true,
        birthDate: true,
        averageRating: true,
        reviewCount: true,
        photoUrl: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      take: 50,
    });

    const guideIds = guides.map((guide) => guide.id);
    const [blockedRows, lockedByGuide] = await Promise.all([
      guideIds.length === 0
        ? Promise.resolve(
            [] as { guideId: string; date: Date; isAvailable: boolean }[],
          )
        : this.prisma.guideAvailability.findMany({
            where: {
              guideId: { in: guideIds },
              deletedAt: null,
              date: { gte: from, lte: to },
              isAvailable: false,
            },
            select: { guideId: true, date: true, isAvailable: true },
          }),
      this.lockedGuideDaysByGuides(guideIds, from, to),
    ]);

    const unavailable = new Map<string, Set<string>>();
    for (const row of blockedRows) {
      const key = row.guideId;
      if (!unavailable.has(key)) unavailable.set(key, new Set());
      unavailable.get(key)!.add(dayKey(row.date));
    }
    for (const [guideId, lockedDays] of lockedByGuide) {
      if (!unavailable.has(guideId)) unavailable.set(guideId, new Set());
      for (const day of lockedDays) unavailable.get(guideId)!.add(day);
    }

    let data = guides.map((guide) => {
      const blocked = unavailable.get(guide.id) ?? new Set<string>();
      const unavailableDayCount = days.filter((day) =>
        blocked.has(dayKey(day)),
      ).length;
      return {
        id: guide.id,
        firstName: guide.firstName,
        lastName: guide.lastName,
        email: guide.email,
        identityNumber: guide.identityNumber,
        city: guide.city,
        languages: guide.languages,
        oda: guide.oda,
        sicilNo: guide.sicilNo,
        ruhsatNo: guide.ruhsatNo,
        ruhsatExpiresAt: guide.ruhsatExpiresAt
          ? guide.ruhsatExpiresAt.toISOString().slice(0, 10)
          : null,
        birthDate: guide.birthDate
          ? guide.birthDate.toISOString().slice(0, 10)
          : null,
        averageRating: guide.averageRating
          ? guide.averageRating.toString()
          : null,
        reviewCount: guide.reviewCount,
        photoUrl: guide.photoUrl,
        isAvailableForRange: unavailableDayCount === 0,
        unavailableDayCount,
        isRuhsatExpired: guide.ruhsatExpiresAt
          ? guide.ruhsatExpiresAt.getTime() < Date.now()
          : false,
      };
    });

    if (options?.availableOnly) {
      data = data.filter((row) => row.isAvailableForRange);
    }

    return { success: true as const, data, error: null };
  }

  /**
   * Agency read model: active vehicles of VERIFIED bus companies
   * + whether every day in [from,to] is free. Optional seatLayoutKind filter.
   */
  async listVehiclesForRange(
    fromIso: string,
    toIso: string,
    options?: {
      kind?: BusLayoutKind;
      q?: string;
      availableOnly?: boolean;
    },
  ) {
    const from = parseDay(fromIso);
    const to = parseDay(toIso);
    this.assertRange(from, to);
    const days = eachDay(from, to);
    const search = options?.q?.trim();

    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        ...(options?.kind ? { seatLayoutKind: options.kind } : {}),
        busCompany: {
          deletedAt: null,
          status: 'VERIFIED',
        },
        ...(search
          ? {
              OR: [
                { plateNumber: { contains: search, mode: 'insensitive' } },
                {
                  busCompany: {
                    companyName: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  busCompany: {
                    contactEmail: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  busCompany: {
                    city: { contains: search, mode: 'insensitive' },
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        plateNumber: true,
        seatLayoutKind: true,
        capacity: true,
        modelYear: true,
        busCompany: {
          select: {
            id: true,
            companyName: true,
            contactEmail: true,
            city: true,
          },
        },
      },
      orderBy: [{ plateNumber: 'asc' }],
      take: 50,
    });

    const vehicleIds = vehicles.map((vehicle) => vehicle.id);
    const [blockedRows, lockedByVehicle] = await Promise.all([
      vehicleIds.length === 0
        ? Promise.resolve(
            [] as { vehicleId: string; date: Date; isAvailable: boolean }[],
          )
        : this.prisma.vehicleAvailability.findMany({
            where: {
              vehicleId: { in: vehicleIds },
              deletedAt: null,
              date: { gte: from, lte: to },
              isAvailable: false,
            },
            select: { vehicleId: true, date: true, isAvailable: true },
          }),
      this.lockedVehicleDaysByVehicles(vehicleIds, from, to),
    ]);

    const unavailable = new Map<string, Set<string>>();
    for (const row of blockedRows) {
      if (!unavailable.has(row.vehicleId)) {
        unavailable.set(row.vehicleId, new Set());
      }
      unavailable.get(row.vehicleId)!.add(dayKey(row.date));
    }
    for (const [vehicleId, lockedDays] of lockedByVehicle) {
      if (!unavailable.has(vehicleId)) unavailable.set(vehicleId, new Set());
      for (const day of lockedDays) unavailable.get(vehicleId)!.add(day);
    }

    let data = vehicles.map((vehicle) => {
      const blocked = unavailable.get(vehicle.id) ?? new Set<string>();
      const unavailableDayCount = days.filter((day) =>
        blocked.has(dayKey(day)),
      ).length;
      return {
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        seatLayoutKind: vehicle.seatLayoutKind,
        capacity: vehicle.capacity,
        modelYear: vehicle.modelYear,
        busCompany: vehicle.busCompany,
        isAvailableForRange: unavailableDayCount === 0,
        unavailableDayCount,
      };
    });

    if (options?.availableOnly) {
      data = data.filter((row) => row.isAvailableForRange);
    }

    return { success: true as const, data, error: null };
  }

  /** True when no closed/locked day in inclusive range. */
  async isGuideAvailableForRange(
    guideId: string,
    fromIso: string,
    toIso: string,
  ): Promise<boolean> {
    const result = await this.listGuideDays(guideId, fromIso, toIso);
    return result.data.every((day) => day.isAvailable && !day.locked);
  }

  async listGuideDays(
    guideId: string,
    fromIso: string,
    toIso: string,
  ): Promise<{ success: true; data: AvailabilityDay[]; error: null }> {
    await this.requireGuide(guideId);
    const from = parseDay(fromIso);
    const to = parseDay(toIso);
    this.assertRange(from, to);

    const [rows, locked] = await Promise.all([
      this.prisma.guideAvailability.findMany({
        where: {
          guideId,
          deletedAt: null,
          date: { gte: from, lte: to },
        },
        select: { date: true, isAvailable: true },
      }),
      this.lockedGuideDays(guideId, from, to),
    ]);

    const byDate = new Map(
      rows.map((row) => [dayKey(row.date), row.isAvailable]),
    );

    const data = eachDay(from, to).map((day) => {
      const key = dayKey(day);
      const isLocked = locked.has(key);
      const stored = byDate.get(key);
      return {
        date: key,
        isAvailable: isLocked ? false : (stored ?? true),
        locked: isLocked,
        lockReason: isLocked ? ('ASSIGNMENT' as const) : null,
      };
    });

    return { success: true, data, error: null };
  }

  async setGuideDay(
    guideId: string,
    dateIso: string,
    isAvailable: boolean,
  ): Promise<{ success: true; data: AvailabilityDay; error: null }> {
    await this.requireGuide(guideId);
    const day = parseDay(dateIso);
    const locked = await this.lockedGuideDays(guideId, day, day);
    if (locked.has(dayKey(day))) {
      throw new ForbiddenException({
        code: 'AVAILABILITY_LOCKED',
        message: 'Atama ile kapatılmış gün değiştirilemez',
      });
    }

    const row = await this.prisma.guideAvailability.upsert({
      where: { guideId_date: { guideId, date: day } },
      create: { guideId, date: day, isAvailable },
      update: { isAvailable, deletedAt: null },
    });

    return {
      success: true,
      data: {
        date: dayKey(row.date),
        isAvailable: row.isAvailable,
        locked: false,
        lockReason: null,
      },
      error: null,
    };
  }

  async listVehicles(busCompanyId: string) {
    await this.requireBusCompany(busCompanyId);
    const vehicles = await this.prisma.vehicle.findMany({
      where: { busCompanyId, deletedAt: null },
      orderBy: { plateNumber: 'asc' },
      select: {
        id: true,
        plateNumber: true,
        seatLayoutKind: true,
        capacity: true,
        isActive: true,
        modelYear: true,
      },
    });
    return { success: true, data: vehicles, error: null };
  }

  async listVehicleDays(
    busCompanyId: string,
    vehicleId: string,
    fromIso: string,
    toIso: string,
  ): Promise<{ success: true; data: AvailabilityDay[]; error: null }> {
    await this.requireOwnedVehicle(busCompanyId, vehicleId);
    const from = parseDay(fromIso);
    const to = parseDay(toIso);
    this.assertRange(from, to);

    const [rows, locked] = await Promise.all([
      this.prisma.vehicleAvailability.findMany({
        where: {
          vehicleId,
          deletedAt: null,
          date: { gte: from, lte: to },
        },
        select: { date: true, isAvailable: true },
      }),
      this.lockedVehicleDays(vehicleId, from, to),
    ]);

    const byDate = new Map(
      rows.map((row) => [dayKey(row.date), row.isAvailable]),
    );

    const data = eachDay(from, to).map((day) => {
      const key = dayKey(day);
      const isLocked = locked.has(key);
      const stored = byDate.get(key);
      return {
        date: key,
        isAvailable: isLocked ? false : (stored ?? true),
        locked: isLocked,
        lockReason: isLocked ? ('ASSIGNMENT' as const) : null,
      };
    });

    return { success: true, data, error: null };
  }

  async setVehicleDay(
    busCompanyId: string,
    vehicleId: string,
    dateIso: string,
    isAvailable: boolean,
  ): Promise<{ success: true; data: AvailabilityDay; error: null }> {
    await this.requireOwnedVehicle(busCompanyId, vehicleId);
    const day = parseDay(dateIso);
    const locked = await this.lockedVehicleDays(vehicleId, day, day);
    if (locked.has(dayKey(day))) {
      throw new ForbiddenException({
        code: 'AVAILABILITY_LOCKED',
        message: 'Atama ile kapatılmış gün değiştirilemez',
      });
    }

    const row = await this.prisma.vehicleAvailability.upsert({
      where: { vehicleId_date: { vehicleId, date: day } },
      create: { vehicleId, date: day, isAvailable },
      update: { isAvailable, deletedAt: null },
    });

    return {
      success: true,
      data: {
        date: dayKey(row.date),
        isAvailable: row.isAvailable,
        locked: false,
        lockReason: null,
      },
      error: null,
    };
  }

  private assertRange(from: Date, to: Date) {
    if (from.getTime() > to.getTime()) {
      throw new BusinessException(
        'INVALID_RANGE',
        'from, to değerinden sonra olamaz',
      );
    }
    const maxMs = 93 * 24 * 60 * 60 * 1000;
    if (to.getTime() - from.getTime() > maxMs) {
      throw new BusinessException(
        'RANGE_TOO_LARGE',
        'Tarih aralığı en fazla ~3 ay olabilir',
      );
    }
  }

  private async requireGuide(guideId: string) {
    const guide = await this.prisma.guide.findFirst({
      where: { id: guideId, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!guide) {
      throw new NotFoundException({
        code: 'GUIDE_NOT_FOUND',
        message: 'Rehber bulunamadı',
      });
    }
    return guide;
  }

  private async requireBusCompany(busCompanyId: string) {
    const bus = await this.prisma.busCompany.findFirst({
      where: { id: busCompanyId, deletedAt: null },
      select: { id: true },
    });
    if (!bus) {
      throw new NotFoundException({
        code: 'BUS_COMPANY_NOT_FOUND',
        message: 'Otobüs firması bulunamadı',
      });
    }
    return bus;
  }

  private async requireOwnedVehicle(busCompanyId: string, vehicleId: string) {
    await this.requireBusCompany(busCompanyId);
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, busCompanyId, deletedAt: null },
      select: { id: true },
    });
    if (!vehicle) {
      throw new NotFoundException({
        code: 'VEHICLE_NOT_FOUND',
        message: 'Araç bulunamadı',
      });
    }
    return vehicle;
  }

  private async lockedGuideDays(
    guideId: string,
    from: Date,
    to: Date,
  ): Promise<Set<string>> {
    const map = await this.lockedGuideDaysByGuides([guideId], from, to);
    return map.get(guideId) ?? new Set();
  }

  private async lockedGuideDaysByGuides(
    guideIds: string[],
    from: Date,
    to: Date,
  ): Promise<Map<string, Set<string>>> {
    const result = new Map<string, Set<string>>();
    if (guideIds.length === 0) return result;

    const assignments = await this.prisma.tourDateAssignment.findMany({
      where: {
        guideId: { in: guideIds },
        status: 'ACCEPTED',
        deletedAt: null,
        tourDate: {
          deletedAt: null,
          startDate: { lte: to },
          endDate: { gte: from },
        },
      },
      select: {
        guideId: true,
        tourDate: { select: { startDate: true, endDate: true } },
      },
    });

    for (const assignment of assignments) {
      if (!assignment.guideId) continue;
      const expanded = this.expandAssignmentDays([assignment], from, to);
      if (!result.has(assignment.guideId)) {
        result.set(assignment.guideId, new Set());
      }
      for (const day of expanded) {
        result.get(assignment.guideId)!.add(day);
      }
    }
    return result;
  }

  private async lockedVehicleDays(
    vehicleId: string,
    from: Date,
    to: Date,
  ): Promise<Set<string>> {
    const map = await this.lockedVehicleDaysByVehicles([vehicleId], from, to);
    return map.get(vehicleId) ?? new Set();
  }

  private async lockedVehicleDaysByVehicles(
    vehicleIds: string[],
    from: Date,
    to: Date,
  ): Promise<Map<string, Set<string>>> {
    const result = new Map<string, Set<string>>();
    if (vehicleIds.length === 0) return result;

    // Mirror: TourDate.vehicleId set after ACCEPTED bus assignment
    const tourDates = await this.prisma.tourDate.findMany({
      where: {
        vehicleId: { in: vehicleIds },
        deletedAt: null,
        startDate: { lte: to },
        endDate: { gte: from },
      },
      select: { vehicleId: true, startDate: true, endDate: true },
    });

    for (const tourDate of tourDates) {
      if (!tourDate.vehicleId) continue;
      const expanded = this.expandAssignmentDays([{ tourDate }], from, to);
      if (!result.has(tourDate.vehicleId)) {
        result.set(tourDate.vehicleId, new Set());
      }
      for (const day of expanded) {
        result.get(tourDate.vehicleId)!.add(day);
      }
    }
    return result;
  }

  private expandAssignmentDays(
    assignments: {
      tourDate: { startDate: Date; endDate: Date };
    }[],
    from: Date,
    to: Date,
  ): Set<string> {
    const locked = new Set<string>();
    for (const assignment of assignments) {
      const start =
        assignment.tourDate.startDate.getTime() > from.getTime()
          ? assignment.tourDate.startDate
          : from;
      const end =
        assignment.tourDate.endDate.getTime() < to.getTime()
          ? assignment.tourDate.endDate
          : to;
      for (const day of eachDay(
        new Date(
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate(),
          ),
        ),
        new Date(
          Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()),
        ),
      )) {
        locked.add(dayKey(day));
      }
    }
    return locked;
  }
}
