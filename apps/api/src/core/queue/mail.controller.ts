import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import { Public } from '../auth/decorators/public.decorator';
import { EmailQueueService } from './email-queue.service';

class EnqueueTestEmailDto {
  @ApiProperty({ example: 'test@turladur.com' })
  @IsEmail()
  to!: string;

  @ApiProperty({ example: 'welcome', required: false })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}

/**
 * Dev/scaffold endpoint to verify Mailhog + BullMQ.
 * Keep @Public only while Sprint 12 scaffolding; lock down in Sprint 13+.
 */
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly emailQueue: EmailQueueService) {}

  @Public()
  @Post('test')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enqueue a test email (Mailhog in dev)' })
  async enqueueTest(@Body() dto: EnqueueTestEmailDto) {
    const jobId = await this.emailQueue.enqueue({
      to: dto.to,
      template: dto.template ?? 'welcome',
      data: dto.data ?? { name: 'Sprint 12' },
    });

    return {
      success: true,
      data: { jobId, mailhogUi: 'http://localhost:8025' },
      error: null,
    };
  }
}
