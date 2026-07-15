import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = config.get<string>(
      'MAIL_FROM',
      'TurlaDur <noreply@turladur.com>',
    );

    this.transporter = nodemailer.createTransport({
      host: config.get<string>('SMTP_HOST', 'localhost'),
      port: Number(config.get<string>('SMTP_PORT', '1025')),
      secure: false,
    });
  }

  async send(payload: MailPayload): Promise<void> {
    const info = await this.transporter.sendMail({
      from: this.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    this.logger.log(`Email sent to ${payload.to} (id=${info.messageId})`);
  }

  async sendTemplate(
    to: string,
    template: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const { subject, html } = this.renderTemplate(template, data);
    await this.send({ to, subject, html });
  }

  private renderTemplate(
    template: string,
    data: Record<string, unknown>,
  ): { subject: string; html: string } {
    switch (template) {
      case 'welcome':
        return {
          subject: 'TurlaDur’a Hoş Geldiniz',
          html: `<p>Merhaba ${String(data.name ?? '')},</p><p>Hesabınız oluşturuldu.</p>`,
        };
      case 'booking-confirmed':
        return {
          subject: `Rezervasyon Onaylandı — ${String(data.tourName ?? '')}`,
          html: `<p>Rezervasyonunuz onaylandı.</p><p>Kod: ${String(data.bookingId ?? '')}</p>`,
        };
      case 'password-reset':
        return {
          subject: 'Şifre Sıfırlama Talebi',
          html: `<p>Şifre sıfırlama linki: <a href="${String(data.resetUrl ?? '#')}">Sıfırla</a></p>`,
        };
      case 'partner-verify':
        return {
          subject: 'Partner hesabınızı doğrulayın — TurlaDur',
          html: `<p>Merhaba,</p><p><strong>${String(data.companyName ?? '')}</strong> partner kaydınız oluşturuldu.</p><p>Doğrulamak için: <a href="${String(data.verifyUrl ?? '#')}">Hesabı doğrula</a></p><p>Token: <code>${String(data.token ?? '')}</code></p>`,
        };
      default:
        return {
          subject: String(data.subject ?? 'TurlaDur Bildirim'),
          html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
        };
    }
  }
}
