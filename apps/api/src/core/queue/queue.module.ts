import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailModule } from '../mail/mail.module';
import { EmailQueueService } from './email-queue.service';
import { MailController } from './mail.controller';
import { EMAIL_QUEUE, EmailProcessor } from './processors/email.processor';

function parseRedisConnection(redisUrl: string) {
  const url = new URL(redisUrl);
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    password: url.password || undefined,
    db: Number(url.pathname.replace('/', '') || 0),
  };
}

@Module({
  imports: [
    MailModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: parseRedisConnection(
          config.get<string>('REDIS_URL', 'redis://localhost:6379'),
        ),
      }),
    }),
    BullModule.registerQueue({ name: EMAIL_QUEUE }),
  ],
  providers: [EmailProcessor, EmailQueueService],
  controllers: [MailController],
  exports: [EmailQueueService, BullModule],
})
export class QueueModule {}
