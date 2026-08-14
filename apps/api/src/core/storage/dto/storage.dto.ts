import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const ALLOWED_FOLDERS = [
  'hotels',
  'tours',
  'activities',
  'operators',
  'users',
  'documents',
] as const;

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
] as const;

export class PresignedUrlDto {
  @ApiProperty({ enum: ALLOWED_FOLDERS, example: 'tours' })
  @IsIn(ALLOWED_FOLDERS)
  folder!: (typeof ALLOWED_FOLDERS)[number];

  @ApiProperty({ example: 'clx123abc' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  entityId!: string;

  @ApiProperty({ example: 'cover.webp' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  filename!: string;

  @ApiProperty({ enum: ALLOWED_CONTENT_TYPES, example: 'image/webp' })
  @IsIn(ALLOWED_CONTENT_TYPES)
  contentType!: (typeof ALLOWED_CONTENT_TYPES)[number];
}

export class ConfirmUploadDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  key!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  publicUrl!: string;
}
