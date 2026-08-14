import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import type { Request, Response } from 'express';

import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../auth/types/auth.types';
import { ConfirmUploadDto, PresignedUrlDto } from './dto/storage.dto';
import { StorageService } from './storage.service';

class DeleteFileQueryDto {
  @ApiProperty({ example: 'tours/clx123/cover.webp' })
  @IsString()
  @MinLength(1)
  key!: string;
}

@ApiTags('storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get('media/*')
  @ApiOperation({
    summary:
      'Public media proxy — streams R2/MinIO objects (dev fallback when r2.dev is unreachable)',
  })
  async serveMedia(@Req() req: Request, @Res() res: Response): Promise<void> {
    const marker = '/storage/media/';
    const markerIndex = req.path.indexOf(marker);
    if (markerIndex < 0) {
      throw new NotFoundException('Object not found');
    }
    const key = decodeURIComponent(req.path.slice(markerIndex + marker.length));
    const object = await this.storageService.getObjectStream(key);
    res.setHeader('Content-Type', object.contentType);
    res.setHeader('Cache-Control', object.cacheControl);
    if (object.contentLength != null) {
      res.setHeader('Content-Length', String(object.contentLength));
    }
    object.body.pipe(res);
  }

  @Post('presigned-url')
  @ApiOperation({
    summary:
      'Get presigned upload URL (direct-to-storage; publicUrl uses CDN_URL)',
  })
  async getPresignedUrl(
    @Body() dto: PresignedUrlDto,
    @CurrentUser() _user: UserPayload,
  ) {
    const key = this.storageService.generateKey(
      dto.folder,
      dto.entityId,
      dto.filename,
    );
    const uploadUrl = await this.storageService.getPresignedUploadUrl(
      key,
      dto.contentType,
    );
    const publicUrl = this.storageService.getPublicUrl(key);

    return {
      success: true,
      data: {
        uploadUrl,
        publicUrl,
        key,
        cdnBase: this.storageService.getCdnBaseUrl(),
        uploadHeaders: this.storageService.getUploadHeaders(dto.contentType),
      },
      error: null,
    };
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm upload (DB persist comes with catalog module)',
  })
  confirmUpload(@Body() dto: ConfirmUploadDto) {
    return {
      success: true,
      data: { url: dto.publicUrl, key: dto.key },
      error: null,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a file by storage key' })
  async deleteFile(@Query() query: DeleteFileQueryDto) {
    await this.storageService.deleteFile(query.key);
    return { success: true, data: null, error: null };
  }
}
