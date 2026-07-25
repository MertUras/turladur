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
import { Throttle } from '@nestjs/throttler';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreateCommentDto,
  CreatePostDto,
  SearchPostsDto,
  UpdateCommentDto,
  UpdatePostDto,
} from '../dto/content.dto';
import { ContentService } from '../services/content.service';

@ApiTags('Content - Posts')
@Controller('content/posts')
export class PostController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get()
  @ApiOperation({ summary: 'List published posts' })
  search(@Query() dto: SearchPostsDto, @CurrentUser() user?: UserPayload) {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    return this.contentService.searchPosts(dto, isAdmin);
  }

  @Public()
  @Get(':id/comments')
  @ApiOperation({ summary: 'List comments on a post' })
  listComments(@Param('id') id: string) {
    return this.contentService.listComments(id);
  }

  @Post(':id/comments')
  @ApiBearerAuth()
  @Roles(
    Role.CUSTOMER,
    Role.PARTNER,
    Role.PARTNER_STAFF,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Add comment to published post' })
  createComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.createComment(id, dto, user.userId);
  }

  @Patch(':id/comments/:commentId')
  @ApiBearerAuth()
  @Roles(
    Role.CUSTOMER,
    Role.PARTNER,
    Role.PARTNER_STAFF,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Update own comment' })
  updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.updateComment(id, commentId, dto, {
      userId: user.userId,
      role: user.role,
    });
  }

  @Delete(':id/comments/:commentId')
  @ApiBearerAuth()
  @Roles(
    Role.CUSTOMER,
    Role.PARTNER,
    Role.PARTNER_STAFF,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Soft-delete own comment' })
  deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.softDeleteComment(id, commentId, {
      userId: user.userId,
      role: user.role,
    });
  }

  @Public()
  @Get(':slugOrId')
  @ApiOperation({ summary: 'Get post by slug or id' })
  getBySlugOrId(
    @Param('slugOrId') slugOrId: string,
    @CurrentUser() user?: UserPayload,
  ) {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    return this.contentService.getPostBySlugOrId(slugOrId, isAdmin);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create post (admin)' })
  create(@Body() dto: CreatePostDto, @CurrentUser() user: UserPayload) {
    return this.contentService.createPost(dto, user.userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update post' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.contentService.updatePost(id, dto, {
      userId: user.userId,
      role: user.role,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete post' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.contentService.softDeletePost(id, {
      userId: user.userId,
      role: user.role,
    });
  }
}
