import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@turladur/shared-constants';

import { Roles } from '../../../core/auth/decorators/roles.decorator';
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
}
