import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { Response } from 'express';

import { BusinessException } from '../../shared/exceptions/business.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Bir sorun oluştu, lütfen tekrar deneyin.';

    if (exception instanceof BusinessException) {
      status = exception.statusCode;
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = `HTTP_${status}`;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const body = exceptionResponse as {
          code?: string;
          message?: string | string[];
          error?: string;
        };

        if (Array.isArray(body.message)) {
          code = 'VALIDATION_ERROR';
          message = body.message.join('; ');
        } else {
          code = body.code ?? `HTTP_${status}`;
          message = body.message ?? body.error ?? exception.message ?? message;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    // 4xx / BusinessException → Sentry'ye gitmez (free kota + noise).
    if (status >= 500) {
      Sentry.captureException(exception);
      this.logger.error(
        `${code}: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      message = 'Bir sorun oluştu, lütfen tekrar deneyin.';
      code = code === 'INTERNAL_ERROR' ? code : 'INTERNAL_ERROR';
    }

    response.status(status).json({
      success: false,
      data: null,
      error: { code, message },
    });
  }
}
