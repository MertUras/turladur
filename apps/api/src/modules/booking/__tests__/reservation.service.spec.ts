import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

import { PrismaService } from '../../../core/database/prisma.service';
import { Prisma } from '../../../generated/prisma';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { createPrismaMock } from '../../__tests__/test-helpers';
import { ReservationService } from '../services/reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let events: { emit: jest.Mock };

  const guests = [
    {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      identityNumber: '10000000146',
      phone: '+905551112233',
      email: 'ahmet@example.com',
      address: 'Kadıköy, İstanbul',
    },
    {
      firstName: 'Ayşe',
      lastName: 'Yılmaz',
      identityNumber: '10000000146',
      phone: '+905551112244',
      email: 'ayse@example.com',
      address: 'Kadıköy, İstanbul',
    },
  ];

  const billing = {
    line1: 'Bağdat Cad. No:1',
    city: 'İstanbul',
    country: 'Türkiye',
  };
  beforeEach(async () => {
    prisma = createPrismaMock();
    events = { emit: jest.fn() };

    const module = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventEmitter2, useValue: events },
      ],
    }).compile();

    service = module.get(ReservationService);
  });

  it('should reject when guest count mismatches party size', async () => {
    await expect(
      service.create(
        {
          tourDateId: 'td1',
          adults: 2,
          children: 0,
          contactEmail: 'a@b.com',
          contactPhone: '+905551112233',
          guests: [
            {
              firstName: 'A',
              lastName: 'B',
              identityNumber: '10000000146',
              phone: '+905551112233',
              email: 'a@b.com',
              address: 'Test Adres 1',
            },
          ],
          billing,
        },
        'u1',
      ),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should reject when more than one product is selected', async () => {
    await expect(
      service.create(
        {
          tourDateId: 'td1',
          roomId: 'r1',
          adults: 2,
          contactEmail: 'a@b.com',
          contactPhone: '+905551112233',
          guests,
          billing,
        },
        'u1',
      ),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should create a tour reservation and decrement capacity', async () => {
    (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
      id: 'td1',
      tourId: 't1',
      remainingCapacity: 10,
      priceOverride: null,
      tour: {
        id: 't1',
        partnerId: 'p1',
        price: new Prisma.Decimal(1500),
        currency: 'TRY',
        status: 'PUBLISHED',
        deletedAt: null,
      },
    });
    (prisma.tourDate.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.reservation.create as jest.Mock).mockResolvedValue({
      id: 'res1',
      bookingNumber: 'TD-ABC',
      userId: 'u1',
      tourId: 't1',
      tourDateId: 'td1',
      hotelId: null,
      roomId: null,
      experienceId: null,
      activityDateId: null,
      partnerId: 'p1',
      status: 'PENDING',
      adults: 2,
      children: 0,
      totalAmount: new Prisma.Decimal(3000),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create(
      {
        tourDateId: 'td1',
        adults: 2,
        contactEmail: 'a@b.com',
        contactPhone: '+905551112233',
        guests,
        billing,
      },
      'u1',
    );

    expect(result.data.tourDateId).toBe('td1');
    expect(result.data.totalAmount).toBe('3000');
    expect(events.emit).toHaveBeenCalledWith(
      'booking.created',
      expect.anything(),
    );
  });

  it('should create a hotel reservation with nights pricing', async () => {
    (prisma.room.findFirst as jest.Mock).mockResolvedValue({
      id: 'r1',
      hotelId: 'h1',
      capacity: 4,
      available: true,
      price: new Prisma.Decimal(1000),
      discount: null,
      deletedAt: null,
      hotel: { partnerId: 'p1', deletedAt: null },
    });
    (prisma.reservation.create as jest.Mock).mockResolvedValue({
      id: 'res2',
      bookingNumber: 'TD-HOT',
      userId: 'u1',
      tourId: null,
      tourDateId: null,
      hotelId: 'h1',
      roomId: 'r1',
      experienceId: null,
      activityDateId: null,
      partnerId: 'p1',
      status: 'PENDING',
      adults: 2,
      children: 0,
      totalAmount: new Prisma.Decimal(2000),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create(
      {
        roomId: 'r1',
        startDate: '2026-08-10',
        endDate: '2026-08-12',
        adults: 2,
        contactEmail: 'a@b.com',
        contactPhone: '+905551112233',
        guests,
        billing,
      },
      'u1',
    );

    expect(result.data.roomId).toBe('r1');
    expect(result.data.hotelId).toBe('h1');
    expect(prisma.reservation.create).toHaveBeenCalled();
  });

  it('should create an experience reservation', async () => {
    (prisma.activityDate.findFirst as jest.Mock).mockResolvedValue({
      id: 'ad1',
      experienceId: 'e1',
      price: new Prisma.Decimal(500),
      availableSeats: 10,
      remainingCapacity: 8,
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-15'),
      experience: {
        partnerId: 'p1',
        currency: 'TRY',
        status: 'PUBLISHED',
        deletedAt: null,
      },
    });
    (prisma.activityDate.updateMany as jest.Mock).mockResolvedValue({
      count: 1,
    });
    (prisma.reservation.create as jest.Mock).mockResolvedValue({
      id: 'res3',
      bookingNumber: 'TD-EXP',
      userId: 'u1',
      tourId: null,
      tourDateId: null,
      hotelId: null,
      roomId: null,
      experienceId: 'e1',
      activityDateId: 'ad1',
      partnerId: 'p1',
      status: 'PENDING',
      adults: 2,
      children: 0,
      totalAmount: new Prisma.Decimal(1000),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create(
      {
        activityDateId: 'ad1',
        adults: 2,
        contactEmail: 'a@b.com',
        contactPhone: '+905551112233',
        guests,
        billing,
      },
      'u1',
    );

    expect(result.data.activityDateId).toBe('ad1');
    expect(result.data.experienceId).toBe('e1');
  });

  it('should throw when tour date is not found', async () => {
    (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(
      service.create(
        {
          tourDateId: 'missing',
          adults: 2,
          contactEmail: 'a@b.com',
          contactPhone: '+905551112233',
          guests,
          billing,
        },
        'u1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should require hotel dates and reject over capacity', async () => {
    await expect(
      service.create(
        {
          roomId: 'r1',
          adults: 2,
          contactEmail: 'a@b.com',
          contactPhone: '+905551112233',
          guests,
          billing,
        },
        'u1',
      ),
    ).rejects.toBeInstanceOf(BusinessException);

    (prisma.room.findFirst as jest.Mock).mockResolvedValue({
      id: 'r1',
      hotelId: 'h1',
      capacity: 1,
      available: true,
      price: new Prisma.Decimal(1000),
      discount: null,
      deletedAt: null,
      hotel: { partnerId: 'p1', deletedAt: null },
    });

    await expect(
      service.create(
        {
          roomId: 'r1',
          startDate: '2026-08-10',
          endDate: '2026-08-12',
          adults: 2,
          contactEmail: 'a@b.com',
          contactPhone: '+905551112233',
          guests,
          billing,
        },
        'u1',
      ),
    ).rejects.toBeInstanceOf(BusinessException);
  });

  it('should cancel reservation and restore tour capacity', async () => {
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue({
      id: 'res1',
      userId: 'u1',
      partnerId: 'p1',
      status: 'PENDING',
      adults: 2,
      children: 0,
      tourDateId: 'td1',
      activityDateId: null,
      tourId: 't1',
      hotelId: null,
      roomId: null,
      experienceId: null,
      bookingNumber: 'TD-1',
      totalAmount: new Prisma.Decimal(100),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    (prisma.tourDate.update as jest.Mock).mockResolvedValue({});
    (prisma.reservation.update as jest.Mock).mockResolvedValue({
      id: 'res1',
      userId: 'u1',
      partnerId: 'p1',
      status: 'CANCELLED',
      adults: 2,
      children: 0,
      tourDateId: 'td1',
      activityDateId: null,
      tourId: 't1',
      hotelId: null,
      roomId: null,
      experienceId: null,
      bookingNumber: 'TD-1',
      totalAmount: new Prisma.Decimal(100),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.cancel('res1', 'u1', 'CUSTOMER');
    expect(result.data.status).toBe('CANCELLED');
    expect(prisma.tourDate.update).toHaveBeenCalled();
  });

  it('should list reservations for user', async () => {
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);
    const result = await service.listForUser('u1');
    expect(result.data).toEqual([]);
  });

  it('should get reservation by id for owner', async () => {
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue({
      id: 'res1',
      userId: 'u1',
      partnerId: 'p1',
      status: 'CONFIRMED',
      adults: 1,
      children: 0,
      tourDateId: 'td1',
      activityDateId: null,
      tourId: 't1',
      hotelId: null,
      roomId: null,
      experienceId: null,
      bookingNumber: 'TD-1',
      totalAmount: new Prisma.Decimal(100),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests: [guests[0]],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    const result = await service.getById('res1', 'u1', 'CUSTOMER');
    expect(result.data.id).toBe('res1');
  });

  it('should mark reservation completed', async () => {
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue({
      id: 'res1',
      userId: 'u1',
      partnerId: 'p1',
      status: 'CONFIRMED',
      adults: 1,
      children: 0,
      tourDateId: 'td1',
      activityDateId: null,
      tourId: 't1',
      hotelId: null,
      roomId: null,
      experienceId: null,
      bookingNumber: 'TD-1',
      totalAmount: new Prisma.Decimal(100),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests: [guests[0]],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    (prisma.reservation.update as jest.Mock).mockResolvedValue({
      id: 'res1',
      userId: 'u1',
      partnerId: 'p1',
      status: 'COMPLETED',
      adults: 1,
      children: 0,
      tourDateId: 'td1',
      activityDateId: null,
      tourId: 't1',
      hotelId: null,
      roomId: null,
      experienceId: null,
      bookingNumber: 'TD-1',
      totalAmount: new Prisma.Decimal(100),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests: [guests[0]],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.markCompleted('res1', {
      userId: 'u1',
      role: 'PARTNER',
      partnerId: 'p1',
    });
    expect(result.data.status).toBe('COMPLETED');
    expect(events.emit).toHaveBeenCalledWith(
      'booking.completed',
      expect.anything(),
    );
  });

  it('should cancel experience booking and restore activity capacity', async () => {
    (prisma.reservation.findFirst as jest.Mock).mockResolvedValue({
      id: 'res3',
      userId: 'u1',
      partnerId: 'p1',
      status: 'PENDING',
      adults: 2,
      children: 0,
      tourDateId: null,
      activityDateId: 'ad1',
      tourId: null,
      hotelId: null,
      roomId: null,
      experienceId: 'e1',
      bookingNumber: 'TD-E',
      totalAmount: new Prisma.Decimal(1000),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    (prisma.activityDate.update as jest.Mock).mockResolvedValue({});
    (prisma.reservation.update as jest.Mock).mockResolvedValue({
      id: 'res3',
      userId: 'u1',
      partnerId: 'p1',
      status: 'CANCELLED',
      adults: 2,
      children: 0,
      tourDateId: null,
      activityDateId: 'ad1',
      tourId: null,
      hotelId: null,
      roomId: null,
      experienceId: 'e1',
      bookingNumber: 'TD-E',
      totalAmount: new Prisma.Decimal(1000),
      currency: 'TRY',
      contactEmail: 'a@b.com',
      contactPhone: null,
      guests,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.cancel('res3', 'u1', 'CUSTOMER');
    expect(result.data.status).toBe('CANCELLED');
    expect(prisma.activityDate.update).toHaveBeenCalled();
  });
});
