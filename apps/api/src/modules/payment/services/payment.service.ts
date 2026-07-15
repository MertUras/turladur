import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { PaymentTransaction as SharedPayment } from '@turladur/shared-types';
import { randomUUID } from 'crypto';
import { Prisma } from '../../../generated/prisma';

import { PrismaService } from '../../../core/database/prisma.service';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import {
  PAYMENT_GATEWAY,
  PaymentGateway,
} from '../adapters/payment-gateway.interface';
import { CheckoutPaymentDto } from '../dto/checkout-payment.dto';
import { IyzicoWebhookDto } from '../dto/iyzico-webhook.dto';
import { PaymentCompletedEvent } from '../events/payment-completed.event';
import { PaymentFailedEvent } from '../events/payment-failed.event';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
  ) {}

  async checkout(dto: CheckoutPaymentDto, userId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: dto.reservationId, deletedAt: null },
    });

    if (!reservation) {
      throw new NotFoundException({
        code: 'RESERVATION_NOT_FOUND',
        message: 'Rezervasyon bulunamadı',
      });
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Bu rezervasyon için ödeme yetkiniz yok',
      });
    }

    if (
      reservation.status !== 'PENDING' &&
      reservation.status !== 'PAYMENT_FAILED'
    ) {
      throw new BusinessException(
        'INVALID_RESERVATION_STATUS',
        'Bu rezervasyon için ödeme başlatılamaz',
      );
    }

    const existingSuccess = await this.prisma.paymentTransaction.findFirst({
      where: {
        reservationId: reservation.id,
        status: 'SUCCESS',
      },
    });

    if (existingSuccess) {
      throw new BusinessException(
        'ALREADY_PAID',
        'Bu rezervasyon zaten ödenmiş',
      );
    }

    const conversationId = randomUUID();
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        reservationId: reservation.id,
        amount: reservation.totalAmount,
        currency: reservation.currency,
        status: 'PENDING',
        provider: this.gateway.providerName,
        conversationId,
      },
    });

    const nameParts = dto.cardHolderName.trim().split(/\s+/);
    const result = await this.gateway.initialize({
      conversationId,
      amount: reservation.totalAmount.toString(),
      currency: reservation.currency,
      cardHolderName: dto.cardHolderName,
      cardNumber: dto.cardNumber,
      expireMonth: dto.expireMonth,
      expireYear: dto.expireYear,
      cvc: dto.cvc,
      buyer: {
        id: userId,
        email: reservation.contactEmail,
        name: nameParts[0] ?? 'Musteri',
        surname: nameParts.slice(1).join(' ') || 'Musteri',
      },
    });

    if (result.status === 'AWAITING_3DS') {
      const updated = await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'AWAITING_3DS',
          providerPaymentId: result.providerPaymentId,
          rawResponse: result.raw as Prisma.InputJsonValue,
        },
      });

      return {
        success: true,
        data: {
          ...this.toShared(updated),
          requires3ds: true,
        },
        error: null,
      };
    }

    if (!result.success || result.status === 'FAILED') {
      const updated = await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          errorMessage: result.errorMessage ?? 'Ödeme başarısız',
          rawResponse: result.raw as Prisma.InputJsonValue,
        },
      });

      this.eventEmitter.emit(
        'payment.failed',
        new PaymentFailedEvent(
          updated.id,
          reservation.id,
          result.errorMessage ?? 'Ödeme başarısız',
        ),
      );

      return {
        success: false,
        data: this.toShared(updated),
        error: {
          code: 'PAYMENT_FAILED',
          message: result.errorMessage ?? 'Ödeme başarısız',
        },
      };
    }

    const paid = await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'SUCCESS',
        providerPaymentId: result.providerPaymentId,
        paidAt: new Date(),
        rawResponse: result.raw as Prisma.InputJsonValue,
      },
    });

    this.eventEmitter.emit(
      'payment.completed',
      new PaymentCompletedEvent(
        paid.id,
        reservation.id,
        paid.amount.toString(),
      ),
    );

    return {
      success: true,
      data: this.toShared(paid),
      error: null,
    };
  }

  async handleWebhook(dto: IyzicoWebhookDto) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { conversationId: dto.conversationId },
    });

    if (!transaction) {
      throw new NotFoundException({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Ödeme kaydı bulunamadı',
      });
    }

    if (transaction.status === 'SUCCESS' || transaction.status === 'REFUNDED') {
      return {
        success: true,
        data: this.toShared(transaction),
        error: null,
      };
    }

    const ok = dto.status.toUpperCase() === 'SUCCESS';

    if (ok) {
      const paid = await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          providerPaymentId: dto.paymentId ?? transaction.providerPaymentId,
          paidAt: new Date(),
          rawResponse: dto as unknown as Prisma.InputJsonValue,
        },
      });

      this.eventEmitter.emit(
        'payment.completed',
        new PaymentCompletedEvent(
          paid.id,
          paid.reservationId,
          paid.amount.toString(),
        ),
      );

      return { success: true, data: this.toShared(paid), error: null };
    }

    const failed = await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'FAILED',
        errorMessage: dto.errorMessage ?? 'Webhook: payment failed',
        rawResponse: dto as unknown as Prisma.InputJsonValue,
      },
    });

    this.eventEmitter.emit(
      'payment.failed',
      new PaymentFailedEvent(
        failed.id,
        failed.reservationId,
        dto.errorMessage ?? 'Ödeme başarısız',
      ),
    );

    return {
      success: false,
      data: this.toShared(failed),
      error: { code: 'PAYMENT_FAILED', message: 'Ödeme başarısız' },
    };
  }

  async refund(paymentId: string, amount?: number) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: paymentId },
    });

    if (!transaction) {
      throw new NotFoundException({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Ödeme kaydı bulunamadı',
      });
    }

    if (transaction.status !== 'SUCCESS') {
      throw new BusinessException(
        'REFUND_NOT_ALLOWED',
        'Sadece başarılı ödemeler iade edilebilir',
      );
    }

    if (!transaction.providerPaymentId) {
      throw new BusinessException(
        'MISSING_PROVIDER_PAYMENT_ID',
        'Provider payment id eksik',
      );
    }

    const refundAmount = amount
      ? new Prisma.Decimal(amount)
      : transaction.amount;

    const result = await this.gateway.refund({
      providerPaymentId: transaction.providerPaymentId,
      amount: refundAmount.toString(),
      conversationId: transaction.conversationId,
    });

    if (!result.success) {
      throw new BusinessException(
        'REFUND_FAILED',
        result.errorMessage ?? 'İade başarısız',
      );
    }

    const refunded = await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
        rawResponse: result.raw as Prisma.InputJsonValue,
      },
    });

    return {
      success: true,
      data: this.toShared(refunded),
      error: null,
    };
  }

  private toShared(row: {
    id: string;
    reservationId: string;
    amount: Prisma.Decimal;
    currency: string;
    status: SharedPayment['status'];
    provider: SharedPayment['provider'];
    conversationId: string;
    providerPaymentId: string | null;
    paidAt: Date | null;
  }): SharedPayment {
    return {
      id: row.id,
      reservationId: row.reservationId,
      amount: row.amount.toString(),
      currency: row.currency,
      status: row.status,
      provider: row.provider,
      conversationId: row.conversationId,
      providerPaymentId: row.providerPaymentId,
      paidAt: row.paidAt?.toISOString() ?? null,
    };
  }
}
