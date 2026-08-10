import type { PrismaClient } from '../../src/generated/prisma';

/**
 * Wipe DATA only (TRUNCATE … CASCADE). Tables / migrations stay intact.
 * Multi-schema Nest catalog — never DROP.
 */
export async function wipeAllData(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE
      r RECORD;
    BEGIN
      FOR r IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname IN (
          'identity',
          'catalog',
          'booking',
          'payment',
          'review',
          'notification',
          'analytics',
          'content',
          'outbox',
          'promotion'
        )
      LOOP
        EXECUTE format('TRUNCATE TABLE %I.%I RESTART IDENTITY CASCADE', r.schemaname, r.tablename);
      END LOOP;
    END $$;
  `);
}
