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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import {
  CreatePostDto,
  SearchPostsDto,
  UpdatePostDto,
} from '../../content/dto/content.dto';
import { SetAgencyStatusDto } from '../../identity/dto/agency.dto';
import { AdminService } from '../services/admin.service';

class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsIn(Object.values(Role))
  role?: Role;
}

class UpdatePartnerStatusDto {
  @ApiProperty({ enum: ['VERIFIED', 'REJECTED', 'SUSPENDED'] })
  @IsIn(['VERIFIED', 'REJECTED', 'SUSPENDED'])
  status!: 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
}

class UpdateTourStatusDto {
  @ApiProperty({ enum: ['PUBLISHED', 'ARCHIVED', 'DRAFT'] })
  @IsIn(['PUBLISHED', 'ARCHIVED', 'DRAFT'])
  status!: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT';
}

class UpdateExperienceStatusDto {
  @ApiProperty({ enum: ['PUBLISHED', 'ARCHIVED', 'DRAFT'] })
  @IsIn(['PUBLISHED', 'ARCHIVED', 'DRAFT'])
  status!: 'PUBLISHED' | 'ARCHIVED' | 'DRAFT';
}

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Platform-wide admin statistics' })
  stats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  users() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user role or active flag' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Get('partners')
  @ApiOperation({ summary: 'List partners (optional status filter)' })
  partners(@Query('status') status?: string) {
    return this.adminService.listPartners(status);
  }

  @Patch('partners/:id/status')
  @ApiOperation({ summary: 'Approve / reject / suspend partner' })
  partnerStatus(@Param('id') id: string, @Body() dto: UpdatePartnerStatusDto) {
    return this.adminService.setPartnerStatus(id, dto.status);
  }

  @Get('tours/pending')
  @ApiOperation({ summary: 'Tours awaiting review' })
  pendingTours() {
    return this.adminService.listPendingTours();
  }

  @Patch('tours/:id/status')
  @ApiOperation({ summary: 'Publish / archive / draft a tour' })
  tourStatus(@Param('id') id: string, @Body() dto: UpdateTourStatusDto) {
    return this.adminService.setTourStatus(id, dto.status);
  }

  @Get('experiences/pending')
  @ApiOperation({ summary: 'Experiences awaiting review' })
  pendingExperiences() {
    return this.adminService.listPendingExperiences();
  }

  @Patch('experiences/:id/status')
  @ApiOperation({ summary: 'Publish / archive / draft an experience' })
  experienceStatus(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceStatusDto,
  ) {
    return this.adminService.setExperienceStatus(id, dto.status);
  }

  @Get('agencies')
  @ApiOperation({ summary: 'List agencies (optional status filter)' })
  agencies(@Query('status') status?: string) {
    return this.adminService.listAgencies(status);
  }

  @Patch('agencies/:id/approve')
  @ApiOperation({ summary: 'Approve agency (shortcut → APPROVED)' })
  approveAgency(@Param('id') id: string) {
    return this.adminService.setAgencyStatus(id, 'APPROVED');
  }

  @Patch('agencies/:id/status')
  @ApiOperation({ summary: 'Approve / reject / suspend agency' })
  agencyStatus(@Param('id') id: string, @Body() dto: SetAgencyStatusDto) {
    return this.adminService.setAgencyStatus(id, dto.status);
  }

  @Get('content/posts')
  @ApiOperation({ summary: 'Admin list posts including drafts' })
  contentPosts(@Query() dto: SearchPostsDto) {
    return this.adminService.listContentPosts(dto);
  }

  @Post('content/posts')
  @ApiOperation({ summary: 'Admin create post' })
  createContentPost(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.createContentPost(dto, user.userId);
  }

  @Patch('content/posts/:id')
  @ApiOperation({ summary: 'Admin update post' })
  updateContentPost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.adminService.updateContentPost(id, dto, user);
  }

  @Delete('content/posts/:id')
  @ApiOperation({ summary: 'Admin soft-delete post' })
  deleteContentPost(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.adminService.deleteContentPost(id, user);
  }
}
