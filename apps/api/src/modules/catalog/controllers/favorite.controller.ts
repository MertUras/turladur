import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@turta/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { FavoriteService } from '../services/favorite.service';

class AddFavoriteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  tourId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  experienceId?: string;
}

@ApiTags('Catalog - Favorites')
@ApiBearerAuth()
@Controller('catalog/favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'List my favorites' })
  list(@CurrentUser() user: UserPayload) {
    return this.favoriteService.list(user.userId);
  }

  @Post()
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add favorite (tour XOR experience)' })
  add(@Body() dto: AddFavoriteDto, @CurrentUser() user: UserPayload) {
    return this.favoriteService.add(user.userId, dto);
  }

  @Delete(':id')
  @Roles(Role.CUSTOMER, Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove favorite (soft-delete)' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.favoriteService.remove(id, user.userId);
  }
}
