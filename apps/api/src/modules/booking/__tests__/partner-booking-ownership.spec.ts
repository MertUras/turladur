import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Faz 3/5 ownership guard: partner must not import booking/payment services
 * or write reservation status via Prisma directly in updateReservation path.
 */
describe('Partner booking ownership (static)', () => {
  const partnerServicePath = join(
    __dirname,
    '../../partner/services/partner.service.ts',
  );
  const source = readFileSync(partnerServicePath, 'utf8');

  it('does not import ReservationService / PaymentService', () => {
    expect(source).not.toMatch(
      /from ['"].*booking\/services\/reservation\.service['"]/,
    );
    expect(source).not.toMatch(
      /from ['"].*payment\/services\/payment\.service['"]/,
    );
  });

  it('delegates reservation writes via agency.reservation.update event', () => {
    expect(source).toContain("emitAsync('agency.reservation.update'");
    expect(source).not.toMatch(/reservation\.update\s*\(/);
    expect(source).not.toMatch(/tourDate\.update\s*\(/);
    expect(source).not.toMatch(/activityDate\.update\s*\(/);
  });
});
