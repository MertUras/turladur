import { z } from 'zod';

/**
 * Shared Zod schemas. Domain schemas (booking, auth, tour, ...)
 * will be added in later sprints.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const bookingGuestSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  identityNumber: z.string().min(5).max(20).optional(),
});

export const createReservationSchema = z.object({
  tourDateId: z.string().min(1),
  adults: z.number().int().min(1).max(50),
  children: z.number().int().min(0).max(50).default(0),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7).max(20).optional(),
  guests: z.array(bookingGuestSchema).min(1),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const checkoutPaymentSchema = z.object({
  reservationId: z.string().min(1),
  cardHolderName: z.string().min(2).max(100),
  cardNumber: z.string().min(15).max(19),
  expireMonth: z.string().regex(/^(0[1-9]|1[0-2])$/),
  expireYear: z.string().regex(/^\d{2}$|^\d{4}$/),
  cvc: z.string().min(3).max(4),
});

export type CheckoutPaymentInput = z.infer<typeof checkoutPaymentSchema>;
