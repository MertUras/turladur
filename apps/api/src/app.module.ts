import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from './core/auth/auth.module';
import { CacheModule } from './core/cache/cache.module';
import { PrismaModule } from './core/database/prisma.module';
import { HealthModule } from './core/health/health.module';
import { LoggerModule } from './core/logger/logger.module';
import { MailModule } from './core/mail/mail.module';
import { QueueModule } from './core/queue/queue.module';
import { StorageModule } from './core/storage/storage.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { IdentityModule } from './modules/identity/identity.module';
import { BookingModule } from './modules/booking/booking.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    EventEmitterModule.forRoot(),
    LoggerModule,
    PrismaModule,
    CacheModule,
    AuthModule,
    StorageModule,
    MailModule,
    QueueModule,
    HealthModule,
    IdentityModule,
    CatalogModule,
    BookingModule,
    PaymentModule,
  ],
})
export class AppModule {}
