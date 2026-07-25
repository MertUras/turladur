import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@turta/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { SearchRoutesDto } from '../dto/route.dto';
import { RouteService } from '../services/route.service';

@ApiTags('Catalog - Routes')
@Controller('catalog/routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get()
  @ApiOperation({ summary: 'List curated routes with tour stats' })
  list(@Query() dto: SearchRoutesDto) {
    return this.routeService.list(dto);
  }

  @Get('definitions')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Admin: list static route definitions (curated catalog)',
  })
  definitions(@CurrentUser() user: UserPayload) {
    return this.routeService.listDefinitions(user.role);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Route detail + matching published tours' })
  getById(@Param('id') id: string, @Query() dto: SearchRoutesDto) {
    return this.routeService.getById(id, dto);
  }
}
