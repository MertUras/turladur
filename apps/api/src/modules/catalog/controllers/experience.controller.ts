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
  CreateActivityDateDto,
  CreateExperienceDto,
  SearchExperiencesDto,
  UpdateActivityDateDto,
  UpdateExperienceDto,
} from '../dto/experience.dto';
import { ExperienceService } from '../services/experience.service';

@ApiTags('Catalog - Experiences')
@Controller('catalog/experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get()
  @ApiOperation({ summary: 'Search published experiences' })
  search(@Query() dto: SearchExperiencesDto) {
    return this.experienceService.search(dto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Experience detail' })
  getById(@Param('id') id: string) {
    return this.experienceService.getById(id);
  }

  @Public()
  @Get(':id/dates')
  @ApiOperation({ summary: 'List activity dates' })
  listDates(@Param('id') id: string) {
    return this.experienceService.listDates(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Create experience (partner with EXPERIENCES capability)',
  })
  create(@Body() dto: CreateExperienceDto, @CurrentUser() user: UserPayload) {
    return this.experienceService.create(dto, user.partnerId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update owned experience' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.experienceService.update(id, dto, user.partnerId, user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete experience' })
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.experienceService.softDelete(id, user.partnerId, user.role);
  }

  @Post(':id/dates')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add activity date / capacity window' })
  createDate(
    @Param('id') id: string,
    @Body() dto: CreateActivityDateDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.experienceService.createDate(
      id,
      dto,
      user.partnerId,
      user.role,
    );
  }

  @Patch(':id/dates/:dateId')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update activity date' })
  updateDate(
    @Param('id') id: string,
    @Param('dateId') dateId: string,
    @Body() dto: UpdateActivityDateDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.experienceService.updateDate(
      id,
      dateId,
      dto,
      user.partnerId,
      user.role,
    );
  }

  @Delete(':id/dates/:dateId')
  @ApiBearerAuth()
  @Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete activity date' })
  removeDate(
    @Param('id') id: string,
    @Param('dateId') dateId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.experienceService.softDeleteDate(
      id,
      dateId,
      user.partnerId,
      user.role,
    );
  }
}
