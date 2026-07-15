import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @Post('presigned-url')
  @ApiOperation({ summary: 'Get presigned upload URL (direct-to-MinIO)' })
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
      data: { uploadUrl, publicUrl, key },
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
