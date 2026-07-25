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

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { CreateSubUserDto, UpdateSubUserDto } from '../dto/sub-user.dto';
import { SubUserService } from '../services/sub-user.service';

@ApiTags('Identity - Sub Users')
@ApiBearerAuth()
@Controller('identity/partners/:partnerId/users')
@Roles(Role.PARTNER, Role.ADMIN, Role.SUPER_ADMIN)
export class SubUserController {
  constructor(private readonly subUserService: SubUserService) {}

  @Get()
  @ApiOperation({ summary: 'List partner sub-users' })
  list(
    @Param('partnerId') partnerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.subUserService.list(partnerId, {
      userId: user.userId,
      role: user.role,
      partnerId: user.partnerId,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create partner sub-user' })
  create(
    @Param('partnerId') partnerId: string,
    @Body() dto: CreateSubUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.subUserService.create(partnerId, dto, {
      userId: user.userId,
      role: user.role,
      partnerId: user.partnerId,
    });
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update partner sub-user' })
  update(
    @Param('partnerId') partnerId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateSubUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.subUserService.update(partnerId, userId, dto, {
      userId: user.userId,
      role: user.role,
      partnerId: user.partnerId,
    });
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Soft-delete partner sub-user' })
  remove(
    @Param('partnerId') partnerId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.subUserService.softDelete(partnerId, userId, {
      userId: user.userId,
      role: user.role,
      partnerId: user.partnerId,
    });
  }
}
