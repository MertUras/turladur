import {
  buildPlusOneLayoutJson,
  buildSystemBusLayoutDefs,
  sellableSeatCodes,
} from '../../../shared/utils/bus-seat-layout';
import { BusSeatLayoutService } from '../services/bus-seat-layout.service';
import { createPrismaMock } from '../../__tests__/test-helpers';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';

describe('bus-seat-layout util', () => {
  it('should generate N sellable seats + front-left CREW for 46+1', () => {
    const { layoutJson, cols } = buildPlusOneLayoutJson(46);
    expect(cols).toBe(5);
    const seats = sellableSeatCodes(layoutJson);
    expect(seats).toHaveLength(46);
    expect(seats[0]).toBe('1');
    expect(seats[45]).toBe('46');

    const crew = layoutJson.cells.find((cell) => cell.type === 'CREW');
    expect(crew).toMatchObject({ row: 0, col: 0, sellable: false });

    const frontDoors = layoutJson.cells.filter(
      (cell) => cell.type === 'DOOR' && cell.row === 0,
    );
    expect(frontDoors.length).toBeGreaterThanOrEqual(1);
    expect(frontDoors.every((cell) => cell.col >= 3)).toBe(true);

    const seat19 = layoutJson.cells.find((cell) => cell.code === '19');
    const seat20 = layoutJson.cells.find((cell) => cell.code === '20');
    expect(seat19?.row).toBe(seat20?.row);
    const midDoors = layoutJson.cells.filter(
      (cell) => cell.type === 'DOOR' && cell.row === (seat20?.row ?? 0) + 1,
    );
    expect(midDoors.length).toBeGreaterThanOrEqual(1);
    expect(midDoors.every((cell) => cell.col >= 3)).toBe(true);
  });

  it('should omit mid door on 19+1', () => {
    const { layoutJson } = buildPlusOneLayoutJson(19);
    const doorRows = new Set(
      layoutJson.cells
        .filter((cell) => cell.type === 'DOOR')
        .map((cell) => cell.row),
    );
    expect(doorRows.has(0)).toBe(true);
    expect(doorRows.size).toBe(1);
  });

  it('should define all 5 system kinds', () => {
    const defs = buildSystemBusLayoutDefs();
    expect(defs.map((d) => d.kind)).toEqual([
      'BUS_19_PLUS_1',
      'BUS_31_PLUS_1',
      'BUS_35_PLUS_1',
      'BUS_46_PLUS_1',
      'BUS_50_PLUS_1',
    ]);
    expect(defs[3].passengerSeats).toBe(46);
  });
});

describe('BusSeatLayoutService.setTourDateLayout', () => {
  let service: BusSeatLayoutService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module = await Test.createTestingModule({
      providers: [
        BusSeatLayoutService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(BusSeatLayoutService);
  });

  it('should bind layout and set capacity', async () => {
    (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
      id: 'td1',
      capacity: 40,
      remainingCapacity: 40,
      deletedAt: null,
      tour: { agencyId: 'p1', deletedAt: null },
    });
    (prisma.busSeatLayout.findFirst as jest.Mock).mockResolvedValue({
      id: 'lay1',
      kind: 'BUS_46_PLUS_1',
      passengerSeats: 46,
    });
    (prisma.seatAssignment.count as jest.Mock).mockResolvedValue(0);
    (prisma.tourDate.update as jest.Mock).mockResolvedValue({
      id: 'td1',
      capacity: 46,
      remainingCapacity: 46,
      busSeatLayoutId: 'lay1',
    });

    const result = await service.setTourDateLayout(
      'td1',
      'BUS_46_PLUS_1',
      'p1',
      'PARTNER',
    );

    expect(result.data.tourDate.capacity).toBe(46);
    expect(prisma.tourDate.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          busSeatLayoutId: 'lay1',
          capacity: 46,
          remainingCapacity: 46,
        }),
      }),
    );
  });

  it('should reject when sold > passengerSeats', async () => {
    (prisma.tourDate.findFirst as jest.Mock).mockResolvedValue({
      id: 'td1',
      capacity: 50,
      remainingCapacity: 0,
      deletedAt: null,
      tour: { agencyId: 'p1', deletedAt: null },
    });
    (prisma.busSeatLayout.findFirst as jest.Mock).mockResolvedValue({
      id: 'lay1',
      kind: 'BUS_19_PLUS_1',
      passengerSeats: 19,
    });

    await expect(
      service.setTourDateLayout('td1', 'BUS_19_PLUS_1', 'p1', 'PARTNER'),
    ).rejects.toBeInstanceOf(BusinessException);
  });
});
