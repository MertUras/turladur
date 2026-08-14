import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

export const REFRESH_COOKIE_NAME = 'turta_refresh';

@Injectable()
export class RefreshCookieService {
  constructor(private readonly config: ConfigService) {}

  cookieName(): string {
    return (
      this.config.get<string>('REFRESH_COOKIE_NAME')?.trim() ||
      REFRESH_COOKIE_NAME
    );
  }

  attach(res: Response, rawToken: string, expiresAt: Date): void {
    const isProd =
      (this.config.get<string>('NODE_ENV') ?? 'development') === 'production';
    const parts = [
      `${this.cookieName()}=${encodeURIComponent(rawToken)}`,
      'Path=/',
      'HttpOnly',
      `SameSite=Lax`,
      `Expires=${expiresAt.toUTCString()}`,
    ];
    if (isProd) parts.push('Secure');
    this.appendSetCookie(res, parts.join('; '));
  }

  clear(res: Response): void {
    const isProd =
      (this.config.get<string>('NODE_ENV') ?? 'development') === 'production';
    const parts = [
      `${this.cookieName()}=`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Max-Age=0',
    ];
    if (isProd) parts.push('Secure');
    this.appendSetCookie(res, parts.join('; '));
  }

  read(req: Request): string | null {
    const header = req.headers.cookie;
    if (!header) return null;
    const name = this.cookieName();
    for (const part of header.split(';')) {
      const [rawKey, ...rest] = part.trim().split('=');
      if (rawKey === name) {
        const value = decodeURIComponent(rest.join('=').trim());
        return value.length > 0 ? value : null;
      }
    }
    return null;
  }

  private appendSetCookie(res: Response, value: string): void {
    const previous = res.getHeader('Set-Cookie');
    if (!previous) {
      res.setHeader('Set-Cookie', value);
      return;
    }
    if (Array.isArray(previous)) {
      res.setHeader('Set-Cookie', [...previous, value]);
      return;
    }
    res.setHeader('Set-Cookie', [String(previous), value]);
  }
}
