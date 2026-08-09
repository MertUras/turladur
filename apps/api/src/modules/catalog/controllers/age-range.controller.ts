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

import {
  AGENCY_SELLER_ROLES,
  resolveActorId,
} from '../../../core/auth/utils/role-access';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { RequireStaffPermissions } from '../../../core/auth/decorators/require-staff-permissions.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { CreateAgeRangeDto, UpdateAgeRangeDto } from '../dto/age-range.dto';
import { AgeRangeService } from '../services/age-range.service';

@ApiTags('Catalog - Age Ranges')
@Controller()
export class AgeRangeController {
  constructor(private readonly ageRangeService: AgeRangeService) {}

  @Public()
  @Get('catalog/tours/:tourId/dates/:dateId/age-ranges')
  @ApiOperation({ summary: 'List age pricing ranges for a tour date' })
  listTour(@Param('tourId') tourId: string, @Param('dateId') dateId: string) {
    return this.ageRangeService.listTourDateAgeRanges(tourId, dateId);
  }

  @Post('catalog/tours/:tourId/dates/:dateId/age-ranges')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Create age range for tour date' })
  createTour(
    @Param('tourId') tourId: string,
    @Param('dateId') dateId: string,
    @Body() dto: CreateAgeRangeDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ageRangeService.createTourDateAgeRange(
      tourId,
      dateId,
      dto,
      user.agencyId,
      user.role,
    );
  }

  @Patch('catalog/tours/:tourId/dates/:dateId/age-ranges/:ageRangeId')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Update tour date age range' })
  updateTour(
    @Param('tourId') tourId: string,
    @Param('dateId') dateId: string,
    @Param('ageRangeId') ageRangeId: string,
    @Body() dto: UpdateAgeRangeDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ageRangeService.updateTourDateAgeRange(
      tourId,
      dateId,
      ageRangeId,
      dto,
      user.agencyId,
      user.role,
    );
  }

  @Delete('catalog/tours/:tourId/dates/:dateId/age-ranges/:ageRangeId')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Soft-delete tour date age range' })
  deleteTour(
    @Param('tourId') tourId: string,
    @Param('dateId') dateId: string,
    @Param('ageRangeId') ageRangeId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ageRangeService.deleteTourDateAgeRange(
      tourId,
      dateId,
      ageRangeId,
      user.agencyId,
      user.role,
      resolveActorId(user),
    );
  }

  @Public()
  @Get('catalog/experiences/:experienceId/dates/:dateId/age-ranges')
  @ApiOperation({ summary: 'List age pricing ranges for an activity date' })
  listExperience(
    @Param('experienceId') experienceId: string,
    @Param('dateId') dateId: string,
  ) {
    return this.ageRangeService.listExperienceDateAgeRanges(
      experienceId,
      dateId,
    );
  }

  @Post('catalog/experiences/:experienceId/dates/:dateId/age-ranges')
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Create age range for activity date' })
  createExperience(
    @Param('experienceId') experienceId: string,
    @Param('dateId') dateId: string,
    @Body() dto: CreateAgeRangeDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ageRangeService.createExperienceDateAgeRange(
      experienceId,
      dateId,
      dto,
      user.agencyId,
      user.role,
    );
  }

  @Patch(
    'catalog/experiences/:experienceId/dates/:dateId/age-ranges/:ageRangeId',
  )
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Update activity date age range' })
  updateExperience(
    @Param('experienceId') experienceId: string,
    @Param('dateId') dateId: string,
    @Param('ageRangeId') ageRangeId: string,
    @Body() dto: UpdateAgeRangeDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ageRangeService.updateExperienceDateAgeRange(
      experienceId,
      dateId,
      ageRangeId,
      dto,
      user.agencyId,
      user.role,
    );
  }

  @Delete(
    'catalog/experiences/:experienceId/dates/:dateId/age-ranges/:ageRangeId',
  )
  @ApiBearerAuth()
  @Roles(...AGENCY_SELLER_ROLES)
  @RequireStaffPermissions('tours')
  @ApiOperation({ summary: 'Soft-delete activity date age range' })
  deleteExperience(
    @Param('experienceId') experienceId: string,
    @Param('dateId') dateId: string,
    @Param('ageRangeId') ageRangeId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.ageRangeService.deleteExperienceDateAgeRange(
      experienceId,
      dateId,
      ageRangeId,
      user.agencyId,
      user.role,
      resolveActorId(user),
    );
  }
}
