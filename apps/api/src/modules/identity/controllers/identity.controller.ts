import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { LoginUserCommand } from '../commands/login-user/login-user.command';
import { RegisterPartnerCommand } from '../commands/register-partner/register-partner.command';
import { RegisterUserCommand } from '../commands/register-user/register-user.command';
import { VerifyPartnerCommand } from '../commands/verify-partner/verify-partner.command';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterPartnerDto } from '../dto/register-partner.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { VerifyPartnerDto } from '../dto/verify-partner.dto';
import { GetProfileQuery } from '../queries/get-profile/get-profile.query';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new customer user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  register(@Body() dto: RegisterUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT access token' })
  login(@Body() dto: LoginUserDto) {
    return this.commandBus.execute(new LoginUserCommand(dto));
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @Roles(
    Role.CUSTOMER,
    Role.PARTNER,
    Role.PARTNER_STAFF,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  profile(@CurrentUser() user: UserPayload) {
    return this.queryBus.execute(new GetProfileQuery(user.userId));
  }

  @Public()
  @Post('partners/register')
  @ApiOperation({ summary: 'Register a partner company + owner account' })
  registerPartner(@Body() dto: RegisterPartnerDto) {
    return this.commandBus.execute(new RegisterPartnerCommand(dto));
  }

  @Public()
  @Post('partners/verify')
  @ApiOperation({ summary: 'Verify partner email with token' })
  verifyPartner(@Body() dto: VerifyPartnerDto) {
    return this.commandBus.execute(new VerifyPartnerCommand(dto.token));
  }
}
