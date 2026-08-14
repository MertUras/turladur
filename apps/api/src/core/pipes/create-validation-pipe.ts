import { ValidationPipe } from '@nestjs/common';

/**
 * Global DTO validation — security.mdc / Sprint 12.12
 * whitelist: strip unknown fields
 * forbidNonWhitelisted: reject unknown fields with 400
 * transform: coerce query/body types
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });
}
