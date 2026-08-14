/**
 * One-shot booking-safe TourDate dedupe (CommonJS).
 *
 * Soft-deactivates unused duplicate windows (remainingCapacity === capacity).
 * Keeps the row with lowest remainingCapacity (has sold seats).
 * Does NOT emit cancel events — reservations stay intact.
 *
 * Usage:
 *   cd apps/api && node prisma/scripts/dedupe-tour-dates.cjs
 *   DATABASE_URL="…" node prisma/scripts/dedupe-tour-dates.cjs
 */
const { PrismaClient } = require('../../src/generated/prisma');

const prisma = new PrismaClient();

function toDayKey(date) {
  return date.toISOString().slice(0, 10);
}

async function main() {
  const tours = await prisma.tour.findMany({
    where: { deletedAt: null },
    select: { id: true, title: true },
  });

  let totalDeactivated = 0;

  for (const tour of tours) {
    const dates = await prisma.tourDate.findMany({
      where: { tourId: tour.id, deletedAt: null, isActive: true },
      orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
    });

    /** @type {Map<string, typeof dates>} */
    const groups = new Map();
    for (const date of dates) {
      const key = `${toDayKey(date.startDate)}|${toDayKey(date.endDate)}`;
      const group = groups.get(key) ?? [];
      group.push(date);
      groups.set(key, group);
    }

    const toDeactivate = [];
    for (const group of groups.values()) {
      if (group.length < 2) continue;
      const sorted = [...group].sort((a, b) => {
        if (a.remainingCapacity !== b.remainingCapacity) {
          return a.remainingCapacity - b.remainingCapacity;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
      for (const duplicate of sorted.slice(1)) {
        if (duplicate.remainingCapacity < duplicate.capacity) continue;
        toDeactivate.push(duplicate.id);
      }
    }

    if (toDeactivate.length === 0) continue;

    await prisma.tourDate.updateMany({
      where: { id: { in: toDeactivate } },
      data: { isActive: false, deletedAt: new Date() },
    });

    totalDeactivated += toDeactivate.length;
    console.log(
      `✓ ${tour.title} (${tour.id}): deactivated ${toDeactivate.length} unused duplicate(s)`,
    );
  }

  console.log(`Done. Total deactivated: ${totalDeactivated}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
