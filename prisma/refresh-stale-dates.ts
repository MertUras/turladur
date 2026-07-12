/**
 * Production helper: shift past tour/activity dates into the future without wiping data.
 *
 * Usage:
 *   DATABASE_URL="..." npx ts-node prisma/refresh-stale-dates.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function addDays(base: Date, days: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return result;
}

function atMidnight(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

async function refreshTourDates(now: Date) {
  const staleDates = await prisma.tourDate.findMany({
    where: { startDate: { lt: now } },
    orderBy: [{ tourId: 'asc' }, { startDate: 'asc' }],
    select: {
      id: true,
      tourId: true,
      startDate: true,
      endDate: true,
      earlyBirdDeadline: true,
      lastMinuteStart: true,
    },
  });

  if (staleDates.length === 0) {
    console.log('No stale tour dates found.');
    return 0;
  }

  const offsets = [14, 45, 75];
  const byTour = new Map<string, typeof staleDates>();

  for (const date of staleDates) {
    const group = byTour.get(date.tourId) ?? [];
    group.push(date);
    byTour.set(date.tourId, group);
  }

  let updated = 0;

  for (const dates of byTour.values()) {
    for (let index = 0; index < dates.length; index++) {
      const date = dates[index];
      const offset = offsets[index % offsets.length];
      const startDate = atMidnight(addDays(now, offset + index * 7));
      const durationDays = Math.max(
        1,
        Math.round(
          (date.endDate.getTime() - date.startDate.getTime()) / (24 * 60 * 60 * 1000)
        ) + 1
      );
      const endDate = atMidnight(addDays(startDate, durationDays - 1));

      await prisma.tourDate.update({
        where: { id: date.id },
        data: {
          startDate,
          endDate,
          status: 'ACTIVE',
          isActive: true,
          earlyBirdDeadline: addDays(startDate, -30),
          lastMinuteStart: addDays(startDate, -14),
        },
      });
      updated++;
    }
  }

  console.log(`Updated ${updated} stale tour date(s).`);
  return updated;
}

async function refreshActivityDates(now: Date) {
  const staleDates = await prisma.activityDate.findMany({
    where: { startDate: { lt: now } },
    orderBy: [{ experienceId: 'asc' }, { startDate: 'asc' }],
    select: { id: true, experienceId: true, startDate: true, endDate: true },
  });

  if (staleDates.length === 0) {
    console.log('No stale activity dates found.');
    return 0;
  }

  const byExperience = new Map<string, typeof staleDates>();

  for (const date of staleDates) {
    const group = byExperience.get(date.experienceId) ?? [];
    group.push(date);
    byExperience.set(date.experienceId, group);
  }

  let updated = 0;

  for (const dates of byExperience.values()) {
    for (let index = 0; index < dates.length; index++) {
      const date = dates[index];
      const startDate = addDays(now, 3 + index);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(13, 0, 0, 0);

      await prisma.activityDate.update({
        where: { id: date.id },
        data: { startDate, endDate },
      });
      updated++;
    }
  }

  console.log(`Updated ${updated} stale activity date(s).`);
  return updated;
}

async function ensureCustomerUsers() {
  const bcrypt = await import('bcrypt');
  const password = await bcrypt.hash('test123', 10);
  const profiles = [
    { email: 'musteri1@tourtech.com', name: 'Ayşe Demir' },
    { email: 'musteri2@tourtech.com', name: 'Mehmet Kaya' },
    { email: 'musteri3@tourtech.com', name: 'Zeynep Arslan' },
    { email: 'musteri4@tourtech.com', name: 'Can Öztürk' },
  ];

  for (const profile of profiles) {
    await prisma.user.upsert({
      where: { email: profile.email },
      update: { name: profile.name, password, role: 'USER' },
      create: {
        email: profile.email,
        name: profile.name,
        password,
        role: 'USER',
      },
    });
  }

  console.log(`Ensured ${profiles.length} customer test user(s).`);
}

async function main() {
  const now = new Date();
  console.log(`Refreshing stale dates as of ${now.toISOString()}...`);

  await ensureCustomerUsers();
  const tourCount = await refreshTourDates(now);
  const activityCount = await refreshActivityDates(now);

  console.log(`Done. tourDates=${tourCount}, activityDates=${activityCount}`);
}

main()
  .catch((error) => {
    console.error('refresh-stale-dates failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
