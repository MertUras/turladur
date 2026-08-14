import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { PLATFORM_ADMIN_ROLES } from '../../../core/auth/utils/role-access';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreatePostDto,
  SearchPostsDto,
  UpdatePageCoverDto,
  UpdatePostDto,
  UpdateRoutePageDto,
} from '../dto/content.dto';
import { ContentService } from '../services/content.service';

/**
 * Platform admin content surface under /admin/content/* (Faz 4).
 * Keeps AdminModule free of ContentService imports; FE paths unchanged.
 */
@ApiTags('Admin - Content')
@ApiBearerAuth()
@Controller('admin/content')
@Roles(...PLATFORM_ADMIN_ROLES)
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Admin list posts including drafts' })
  listPosts(@Query() dto: SearchPostsDto) {
    return this.contentService.searchPosts(
      { ...dto, includeDrafts: true },
      true,
    );
  }

  @Post('posts')
  @ApiOperation({ summary: 'Admin create post' })
  createPost(@Body() dto: CreatePostDto, @CurrentUser() user: UserPayload) {
    return this.contentService.createPost(dto, user.userId);
  }

  @Patch('posts/:id')
  @ApiOperation({ summary: 'Admin update post' })
  updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.updatePost(id, dto, user);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Admin soft-delete post' })
  deletePost(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.contentService.softDeletePost(id, user);
  }

  @Get('page-covers/:key')
  @ApiOperation({ summary: 'Admin get page cover flag' })
  getPageCover(@Param('key') key: string) {
    return this.contentService.getPageCover(key);
  }

  @Patch('page-covers/:key')
  @ApiOperation({ summary: 'Admin toggle page cover' })
  updatePageCover(
    @Param('key') key: string,
    @Body() dto: UpdatePageCoverDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.updatePageCover(key, dto, user.userId);
  }

  @Get('route-pages')
  @ApiOperation({ summary: 'Admin list route page overlays' })
  listRoutePages() {
    return this.contentService.listRoutePages();
  }

  @Get('route-pages/:routeKey')
  @ApiOperation({ summary: 'Admin get route page overlay' })
  getRoutePage(@Param('routeKey') routeKey: string) {
    return this.contentService.getRoutePage(routeKey);
  }

  @Patch('route-pages/:routeKey')
  @ApiOperation({ summary: 'Admin update route SEO/copy overlay' })
  updateRoutePage(
    @Param('routeKey') routeKey: string,
    @Body() dto: UpdateRoutePageDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.updateRoutePage(routeKey, dto, user.userId);
  }
}
