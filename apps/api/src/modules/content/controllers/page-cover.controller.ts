import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '../../../core/auth/decorators/public.decorator';
import { ContentService } from '../services/content.service';

@ApiTags('Content - Page covers')
@Controller('content/page-covers')
export class PageCoverController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Get(':key')
  @ApiOperation({ summary: 'Public page cover flag (missing row = disabled)' })
  get(@Param('key') key: string) {
    return this.contentService.getPageCover(key);
  }
}
