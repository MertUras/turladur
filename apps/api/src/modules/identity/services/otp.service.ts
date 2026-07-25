import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomInt } from 'crypto';

import { MailService } from '../../../core/mail/mail.service';
import { PrismaService } from '../../../core/database/prisma.service';
import { OtpPurpose } from '../../../generated/prisma';
import { BusinessException } from '../../../shared/exceptions/business.exception';
import { OtpPurposeDto } from '../dto/otp.dto';

const OTP_TTL_MS = 2 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

const PURPOSE_COPY: Record<
  OtpPurpose,
  { subject: string; title: string; actionLine: string; purposeLabel: string }
> = {
  REGISTER: {
    subject: 'Hesabınızı oluşturun — turta',
    title: 'Hesabınızı oluşturun',
    actionLine: 'Doğrulama kodunu girerek hesabınızı oluşturabilirsiniz.',
    purposeLabel: 'kayıt',
  },
  PASSWORD_RESET: {
    subject: 'Şifre sıfırlama kodu — turta',
    title: 'Şifrenizi yenileyin',
    actionLine: 'Doğrulama kodunu girerek şifrenizi değiştirebilirsiniz.',
    purposeLabel: 'şifre sıfırlama',
  },
  CHECKOUT: {
    subject: 'Ödeme doğrulama kodu — turta',
    title: 'Ödemeyi doğrulayın',
    actionLine:
      'Doğrulama kodunu girerek rezervasyon ödemesine devam edebilirsiniz.',
    purposeLabel: 'ödeme',
  },
};

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async send(emailRaw: string, purposeDto: OtpPurposeDto, firstName?: string) {
    const email = emailRaw.toLowerCase().trim();
    const purpose = this.mapPurpose(purposeDto);
    const copy = PURPOSE_COPY[purpose];

    await this.assertPurposeRules(email, purpose);

    let greetingName = firstName?.trim() || '';

    if (purpose === OtpPurpose.PASSWORD_RESET) {
      const existing = await this.prisma.user.findFirst({
        where: { email, deletedAt: null, isActive: true },
        select: { firstName: true, lastName: true },
      });
      if (!existing) {
        this.logger.warn(`PASSWORD_RESET OTP skipped — no user for ${email}`);
        return this.sendSuccessPayload(email, purpose);
      }
      if (!greetingName) {
        greetingName =
          [existing.firstName, existing.lastName]
            .filter(Boolean)
            .join(' ')
            .trim() ||
          existing.firstName?.trim() ||
          '';
      }
    }

    if (!greetingName) {
      greetingName = email.split('@')[0] || 'Merhaba';
    }

    const latest = await this.prisma.emailOtp.findFirst({
      where: { email, purpose, verifiedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (latest) {
      const ageMs = Date.now() - latest.createdAt.getTime();
      if (ageMs < OTP_RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((OTP_RESEND_COOLDOWN_MS - ageMs) / 1000);
        throw new BusinessException(
          'OTP_RESEND_TOO_SOON',
          `Yeni kod için ${waitSec} saniye bekleyin`,
          429,
        );
      }
    }

    await this.prisma.emailOtp.deleteMany({
      where: { email, purpose, verifiedAt: null },
    });

    const code = String(randomInt(100_000, 1_000_000));
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.prisma.emailOtp.create({
      data: {
        email,
        purpose,
        codeHash: this.hashCode(code),
        expiresAt,
      },
    });

    try {
      await this.mail.sendTemplate(email, 'otp', {
        code,
        name: greetingName,
        title: copy.title,
        actionLine: copy.actionLine,
        purposeLabel: copy.purposeLabel,
        subject: copy.subject,
        expiresMinutes: Math.floor(OTP_TTL_MS / 60_000),
      });
    } catch (err) {
      this.logger.error(
        `OTP mail failed for ${email}: ${err instanceof Error ? err.message : String(err)}`,
      );
      this.logger.warn(
        `OTP code (mail failed): ${code} → ${email} (${purpose})`,
      );
      if (this.mail.usesRealInbox) {
        throw new BusinessException(
          'OTP_MAIL_FAILED',
          err instanceof Error && err.message.includes('only send')
            ? 'Doğrulama maili gönderilemedi. Şirket domain’i yokken Gmail SMTP (SMTP_USER/SMTP_PASS) gerekir — docs/EMAIL_SETUP.md'
            : 'Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin.',
          422,
        );
      }
    }

    return this.sendSuccessPayload(email, purpose, code);
  }

  async verify(emailRaw: string, purposeDto: OtpPurposeDto, code: string) {
    await this.verifyInternal(
      emailRaw,
      this.mapPurpose(purposeDto),
      code,
      false,
    );
    return {
      success: true,
      data: {
        verified: true,
        email: emailRaw.toLowerCase().trim(),
        purpose: purposeDto,
      },
      error: null,
    };
  }

  /** Verify + delete OTP in one step (register / password reset). */
  async verifyAndConsume(
    emailRaw: string,
    purpose: OtpPurpose,
    code: string,
  ): Promise<void> {
    await this.verifyInternal(emailRaw, purpose, code, true);
  }

  private async verifyInternal(
    emailRaw: string,
    purpose: OtpPurpose,
    code: string,
    consume: boolean,
  ): Promise<void> {
    const email = emailRaw.toLowerCase().trim();

    const record = await this.prisma.emailOtp.findFirst({
      where: { email, purpose, verifiedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BusinessException(
        'OTP_NOT_FOUND',
        'Doğrulama kodu bulunamadı. Yeni kod isteyin.',
      );
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new BusinessException(
        'OTP_EXPIRED',
        'Kodun süresi doldu. Yeni kod isteyin.',
      );
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      throw new BusinessException(
        'OTP_MAX_ATTEMPTS',
        'Çok fazla hatalı deneme. Yeni kod isteyin.',
      );
    }

    const ok = record.codeHash === this.hashCode(code.trim());
    if (!ok) {
      await this.prisma.emailOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BusinessException('OTP_INVALID', 'Doğrulama kodu hatalı');
    }

    if (consume) {
      await this.prisma.emailOtp.delete({ where: { id: record.id } });
    } else {
      await this.prisma.emailOtp.update({
        where: { id: record.id },
        data: { verifiedAt: new Date() },
      });
    }
  }

  private sendSuccessPayload(
    email: string,
    purpose: OtpPurpose,
    code?: string,
  ) {
    const showDebug =
      this.config.get<string>('OTP_SHOW_DEBUG_CODE', '') === 'true' ||
      (!this.mail.usesRealInbox &&
        this.config.get<string>('NODE_ENV', 'development') !== 'production');

    return {
      success: true,
      data: {
        email,
        purpose,
        expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
        resendCooldownSeconds: Math.floor(OTP_RESEND_COOLDOWN_MS / 1000),
        ...(showDebug && code ? { debugCode: code } : {}),
      },
      error: null,
    };
  }

  private async assertPurposeRules(email: string, purpose: OtpPurpose) {
    if (purpose === OtpPurpose.REGISTER) {
      const existing = await this.prisma.user.findFirst({
        where: { email, deletedAt: null },
      });
      if (existing) {
        throw new BusinessException(
          'EMAIL_ALREADY_EXISTS',
          'Bu e-posta adresi zaten kayıtlı',
          409,
        );
      }
    }
  }

  private mapPurpose(purpose: OtpPurposeDto): OtpPurpose {
    return OtpPurpose[purpose];
  }

  private hashCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }
}
