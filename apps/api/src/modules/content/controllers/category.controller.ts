import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';

import {
  PLATFORM_ADMIN_ROLES,
  resolveActorId,
} from '../../../core/auth/utils/role-access';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/content.dto';
import { ContentService } from '../services/content.service';

@ApiTags('Content - Categories')
@Controller('content/categories')
export class CategoryController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List content categories' })
  list() {
    return this.contentService.listCategories();
  }

  @Post()
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Create category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.contentService.createCategory(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Update category' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.contentService.updateCategory(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(...PLATFORM_ADMIN_ROLES)
  @ApiOperation({ summary: 'Soft-delete category' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.contentService.softDeleteCategory(id, resolveActorId(user));
  }
}
