import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cdnUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = config.getOrThrow<string>('MINIO_ENDPOINT');

    this.s3 = new S3Client({
      endpoint,
      region: config.get<string>('S3_REGION', 'eu-central-1'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretAccessKey: config.getOrThrow<string>('MINIO_SECRET_KEY'),
      },
      forcePathStyle: true,
    });

    this.bucket = config.get<string>('S3_BUCKET', 'tourtech-media');
    this.cdnUrl = config.get<string>(
      'CDN_URL',
      `${endpoint.replace(/\/$/, '')}/${this.bucket}`,
    );
  }

  onModuleInit(): void {
    this.logger.log(`Storage ready (bucket=${this.bucket})`);
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
    });
    return getSignedUrl(this.s3, command, { expiresIn });
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

  getPublicUrl(key: string): string {
    return `${this.cdnUrl}/${key}`;
  }

  generateKey(folder: string, entityId: string, filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || 'webp';
    const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
    return `${folder}/${entityId}/${uniqueName}`;
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Lightweight probe: attempt a short-lived signed URL generation
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
