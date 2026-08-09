/** Mirrors Prisma BusLayoutKind + SYSTEM_BUS_LAYOUTS labels (catalog). */
export const BUS_LAYOUT_KINDS = [
  { kind: 'BUS_19_PLUS_1', label: '19+1', passengerSeats: 19 },
  { kind: 'BUS_31_PLUS_1', label: '31+1', passengerSeats: 31 },
  { kind: 'BUS_35_PLUS_1', label: '35+1', passengerSeats: 35 },
  { kind: 'BUS_46_PLUS_1', label: '46+1', passengerSeats: 46 },
  { kind: 'BUS_50_PLUS_1', label: '50+1', passengerSeats: 50 },
] as const;

export type BusLayoutKindValue = (typeof BUS_LAYOUT_KINDS)[number]['kind'];

export function busLayoutLabel(kind: string): string {
  const found = BUS_LAYOUT_KINDS.find((row) => row.kind === kind);
  return found?.label ?? kind.replace(/_/g, ' ');
}
