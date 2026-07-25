import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { Readable } from 'stream';

import { resolveMediaUrl, resolveMediaUrlList } from './resolve-media-url';

/** Long-lived CDN cache — object keys are unique (timestamp + uuid). */
export const PUBLIC_OBJECT_CACHE_CONTROL =
  'public, max-age=31536000, immutable';

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function ensureAbsoluteHttpUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cdnUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = config.getOrThrow<string>('MINIO_ENDPOINT');
    const forcePathStyle =
      (config.get<string>('S3_FORCE_PATH_STYLE') ?? 'true').toLowerCase() !==
      'false';

    this.s3 = new S3Client({
      endpoint,
      region: config.get<string>('S3_REGION', 'eu-central-1'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretAccessKey: config.getOrThrow<string>('MINIO_SECRET_KEY'),
      },
      forcePathStyle,
    });

    this.bucket = config.get<string>('S3_BUCKET', 'tourtech-media');
    // Soft launch without media.* custom domain: stream via Nest public proxy.
    // Prefer CDN_URL; else API_PUBLIC_URL/api/v1/storage/media; else MinIO path.
    const explicitCdn = config.get<string>('CDN_URL')?.trim();
    const apiPublic = config.get<string>('API_PUBLIC_URL')?.trim();
    const proxyFallback = apiPublic
      ? `${stripTrailingSlash(apiPublic)}/api/v1/storage/media`
      : null;
    const endpointFallback = `${stripTrailingSlash(endpoint)}/${this.bucket}`;
    const isLoopback = (url: string) =>
      /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);

    // Never publish localhost MinIO URLs when a public API host exists.
    let resolved = explicitCdn || proxyFallback || endpointFallback;
    if (isLoopback(resolved) && proxyFallback) {
      resolved = proxyFallback;
    }
    if (isLoopback(resolved) && process.env.NODE_ENV === 'production') {
      this.logger.error(
        'CDN resolves to localhost in production — set CDN_URL or API_PUBLIC_URL (R2 media proxy)',
      );
    }
    this.cdnUrl = stripTrailingSlash(ensureAbsoluteHttpUrl(resolved));
  }

  onModuleInit(): void {
    this.logger.log(
      `Storage ready (bucket=${this.bucket}, cdn=${this.cdnUrl})`,
    );
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: PUBLIC_OBJECT_CACHE_CONTROL,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /** Headers the browser MUST send on PUT (included in the signature). */
  getUploadHeaders(contentType: string): Record<string, string> {
    return {
      'Content-Type': contentType,
      'Cache-Control': PUBLIC_OBJECT_CACHE_CONTROL,
    };
  }

  async getPresignedDownloadUrl(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  /**
   * Stream an object for the public media proxy (dev fallback when r2.dev TLS fails).
   */
  async getObjectStream(key: string): Promise<{
    body: Readable;
    contentType: string;
    contentLength?: number;
    cacheControl: string;
  }> {
    const normalizedKey = key.replace(/^\/+/, '');
    if (
      !normalizedKey ||
      normalizedKey.includes('..') ||
      normalizedKey.length > 512
    ) {
      throw new NotFoundException('Object not found');
    }

    try {
      const result = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: normalizedKey,
        }),
      );
      if (!result.Body) {
        throw new NotFoundException('Object not found');
      }
      return {
        body: result.Body as Readable,
        contentType: result.ContentType ?? 'application/octet-stream',
        contentLength: result.ContentLength,
        cacheControl: result.CacheControl ?? PUBLIC_OBJECT_CACHE_CONTROL,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.warn(`getObjectStream failed for key=${normalizedKey}`);
      throw new NotFoundException('Object not found');
    }
  }

  /** Public URL served via CDN (local: MinIO path; prod: https://media.turta.com/…). */
  getPublicUrl(key: string): string {
    const normalizedKey = key.replace(/^\/+/, '');
    return `${this.cdnUrl}/${normalizedKey}`;
  }

  getCdnBaseUrl(): string {
    return this.cdnUrl;
  }

  /**
   * Map a DB-stored URL or storage key to the active CDN_URL.
   * Ensures Vercel/prod clients never receive localhost MinIO links.
   */
  resolvePublicUrl(pathOrUrl: string | null | undefined): string | null {
    return resolveMediaUrl(this.cdnUrl, pathOrUrl);
  }

  resolvePublicUrlList(urls: string[] | null | undefined): string[] {
    return resolveMediaUrlList(this.cdnUrl, urls);
  }

  generateKey(folder: string, entityId: string, filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || 'webp';
    const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    return `${folder}/${entityId}/${uniqueName}`;
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.getPresignedUploadUrl(
        `_health/${randomUUID()}.txt`,
        'text/plain',
        60,
      );
      return true;
    } catch (error) {
      this.logger.error('Storage health check failed', error);
      return false;
    }
  }
}
