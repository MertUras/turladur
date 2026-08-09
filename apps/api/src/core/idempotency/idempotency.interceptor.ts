import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import type { Request } from 'express';

import { IdempotencyService } from './idempotency.service';

type AuthedRequest = Request & {
  user?: { userId?: string };
};

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<AuthedRequest>();

    if (request.method !== 'POST') {
      return next.handle();
    }

    const path = (request.originalUrl || request.url || request.path || '')
      .split('?')[0]
      .replace(/\/$/, '');

    if (!this.idempotencyService.isProtectedPath(path)) {
      return next.handle();
    }

    const rawKey = request.headers['idempotency-key'];
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
    if (!key || typeof key !== 'string' || key.trim().length === 0) {
      // Geriye uyumlu: header yoksa eski davranış (FE henüz göndermiyor)
      return next.handle();
    }

    const trimmedKey = key.trim().slice(0, 128);
    if (trimmedKey.length < 8) {
      throw new BadRequestException({
        code: 'IDEMPOTENCY_KEY_INVALID',
        message: 'Idempotency-Key en az 8 karakter olmalı',
      });
    }

    const requestHash = this.idempotencyService.hashRequest(request.body);

    return from(
      this.resolveOrBegin(trimmedKey, request, path, requestHash),
    ).pipe(
      switchMap((resolved) => {
        if (resolved.cached !== undefined) {
          return of(resolved.cached);
        }

        const recordId = resolved.recordId!;
        return next.handle().pipe(
          tap({
            next: (body) => {
              void this.idempotencyService.complete(
                recordId,
                200,
                body as never,
              );
            },
            error: () => {
              void this.idempotencyService.fail(recordId);
            },
          }),
        );
      }),
    );
  }

  private async resolveOrBegin(
    key: string,
    request: AuthedRequest,
    path: string,
    requestHash: string,
  ): Promise<{ cached?: unknown; recordId?: string }> {
    const existing = await this.idempotencyService.findActive(key);
    if (existing) {
      if (existing.requestHash && existing.requestHash !== requestHash) {
        throw new ConflictException({
          code: 'IDEMPOTENCY_KEY_REUSED',
          message: 'Aynı Idempotency-Key farklı body ile kullanılamaz',
        });
      }
      if (existing.responseBody != null && existing.responseStatus != null) {
        return { cached: existing.responseBody };
      }
      throw new ConflictException({
        code: 'IDEMPOTENCY_IN_PROGRESS',
        message: 'Bu istek hâlâ işleniyor',
      });
    }

    try {
      const created = await this.idempotencyService.begin({
        key,
        userId: request.user?.userId,
        method: request.method,
        path,
        requestHash,
      });
      return { recordId: created.id };
    } catch {
      // Race: başka istek aynı anda oluşturdu
      const again = await this.idempotencyService.findActive(key);
      if (again?.responseBody != null) {
        return { cached: again.responseBody };
      }
      throw new ConflictException({
        code: 'IDEMPOTENCY_IN_PROGRESS',
        message: 'Bu istek hâlâ işleniyor',
      });
    }
  }
}
