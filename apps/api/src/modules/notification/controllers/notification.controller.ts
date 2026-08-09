import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { NotificationService } from '../services/notification.service';

class ListNotificationsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unreadOnly?: boolean;
}

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'List my notifications' })
  list(
    @CurrentUser() user: UserPayload,
    @Query() query: ListNotificationsQueryDto,
  ) {
    return this.notificationService.listForUser(
      user.userId,
      Boolean(query.unreadOnly),
    );
  }

  @Get('agency/:agencyId')
  @ApiOperation({ summary: 'List agency inbox notifications' })
  listAgency(
    @Param('agencyId') agencyId: string,
    @Query() query: ListNotificationsQueryDto,
  ) {
    return this.notificationService.listForAgency(
      agencyId,
      Boolean(query.unreadOnly),
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Unread notification count' })
  unreadCount(@CurrentUser() user: UserPayload) {
    return this.notificationService.unreadCount(user.userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all as read' })
  markAll(@CurrentUser() user: UserPayload) {
    return this.notificationService.markAllRead(user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark one as read' })
  markOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.notificationService.markRead(id, user.userId);
  }
}
