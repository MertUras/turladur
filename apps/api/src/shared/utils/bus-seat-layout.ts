import type { BusLayoutKind } from '../../generated/prisma';

export type LayoutCellType =
  'SEAT' | 'CREW' | 'AISLE' | 'WC' | 'BLOCKED' | 'DOOR';

export interface LayoutCell {
  code: string;
  row: number;
  col: number;
  type: LayoutCellType;
  sellable: boolean;
}

export interface BusLayoutJson {
  orientation: 'front-top';
  legend: string[];
  cells: LayoutCell[];
}

export interface BusLayoutSeedDef {
  kind: BusLayoutKind;
  name: string;
  passengerSeats: number;
  crewSeats: number;
  rows: number;
  cols: number;
  layoutJson: BusLayoutJson;
}

const LEGEND = ['FREE', 'OCCUPIED', 'SELECTED', 'BLOCKED', 'CREW', 'DOOR'];

/**
 * 2. kapı hangi koltuktan sonra (sağ sıra çifti bitişi).
 * 46+1: 19–20 arkası → afterSeat=20.
 * Küçük midibüs (19): genelde tek ön kapı.
 */
export function midDoorAfterSeat(passengerSeats: number): number | null {
  if (passengerSeats <= 19) return null;
  if (passengerSeats <= 35) return 16;
  if (passengerSeats <= 46) return 20;
  return 20;
}

/**
 * 2+2 + koridor (cols=5): L L AISLE R R.
 * Ön: şoför sol (col 0), 1. kapı sağ (col 3–4).
 * Orta: kind’e göre 2. kapı (sağ yan).
 */
export function buildPlusOneLayoutJson(passengerSeats: number): {
  rows: number;
  cols: number;
  layoutJson: BusLayoutJson;
} {
  const cols = 5;
  const cells: LayoutCell[] = [
    { code: 'CREW', row: 0, col: 0, type: 'CREW', sellable: false },
    { code: 'AISLE', row: 0, col: 2, type: 'AISLE', sellable: false },
    { code: 'DOOR_F1', row: 0, col: 3, type: 'DOOR', sellable: false },
    { code: 'DOOR_F2', row: 0, col: 4, type: 'DOOR', sellable: false },
  ];

  const midAfter = midDoorAfterSeat(passengerSeats);
  let midDoorInserted = false;
  let seatNumber = 1;
  let row = 1;

  while (seatNumber <= passengerSeats) {
    for (const col of [0, 1, 3, 4]) {
      if (seatNumber > passengerSeats) break;
      cells.push({
        code: String(seatNumber),
        row,
        col,
        type: 'SEAT',
        sellable: true,
      });
      seatNumber += 1;
    }
    cells.push({
      code: `AISLE_${row}`,
      row,
      col: 2,
      type: 'AISLE',
      sellable: false,
    });

    const lastSeatInRow = seatNumber - 1;
    row += 1;

    if (midAfter != null && !midDoorInserted && lastSeatInRow >= midAfter) {
      cells.push(
        {
          code: 'AISLE_MID',
          row,
          col: 2,
          type: 'AISLE',
          sellable: false,
        },
        {
          code: 'DOOR_M1',
          row,
          col: 3,
          type: 'DOOR',
          sellable: false,
        },
        {
          code: 'DOOR_M2',
          row,
          col: 4,
          type: 'DOOR',
          sellable: false,
        },
      );
      midDoorInserted = true;
      row += 1;
    }
  }

  return {
    rows: row,
    cols,
    layoutJson: {
      orientation: 'front-top',
      legend: LEGEND,
      cells,
    },
  };
}

export const SYSTEM_BUS_LAYOUTS: Omit<
  BusLayoutSeedDef,
  'rows' | 'cols' | 'layoutJson'
>[] = [
  { kind: 'BUS_19_PLUS_1', name: '19+1', passengerSeats: 19, crewSeats: 1 },
  { kind: 'BUS_31_PLUS_1', name: '31+1', passengerSeats: 31, crewSeats: 1 },
  { kind: 'BUS_35_PLUS_1', name: '35+1', passengerSeats: 35, crewSeats: 1 },
  { kind: 'BUS_46_PLUS_1', name: '46+1', passengerSeats: 46, crewSeats: 1 },
  { kind: 'BUS_50_PLUS_1', name: '50+1', passengerSeats: 50, crewSeats: 1 },
];

export function buildSystemBusLayoutDefs(): BusLayoutSeedDef[] {
  return SYSTEM_BUS_LAYOUTS.map((def) => {
    const built = buildPlusOneLayoutJson(def.passengerSeats);
    return { ...def, ...built };
  });
}

export function sellableSeatCodes(layoutJson: BusLayoutJson): string[] {
  return layoutJson.cells
    .filter((cell) => cell.type === 'SEAT' && cell.sellable)
    .map((cell) => cell.code);
}
