import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { UserPayload } from './types/auth.types';

/**
 * JWT plumbing endpoints. Real register/login live in IdentityModule
 * (`POST /identity/register`, `POST /identity/login`).
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Current authenticated user from JWT' })
  me(@CurrentUser() user: UserPayload) {
    return {
      success: true,
      data: user,
      error: null,
    };
  }
}
