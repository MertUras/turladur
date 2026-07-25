import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { ChangePasswordCommand } from '../commands/change-password/change-password.command';
import { LoginUserCommand } from '../commands/login-user/login-user.command';
import { RegisterPartnerCommand } from '../commands/register-partner/register-partner.command';
import { RegisterUserCommand } from '../commands/register-user/register-user.command';
import { UpdateProfileCommand } from '../commands/update-profile/update-profile.command';
import { VerifyPartnerCommand } from '../commands/verify-partner/verify-partner.command';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterPartnerDto } from '../dto/register-partner.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { VerifyPartnerDto } from '../dto/verify-partner.dto';
import { GuestBootstrapDto } from '../dto/guest-bootstrap.dto';
import { ResetPasswordDto, SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { GetProfileQuery } from '../queries/get-profile/get-profile.query';
import { IdentityService } from '../services/identity.service';
import { OtpService } from '../services/otp.service';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly identityService: IdentityService,
    private readonly otpService: OtpService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  @ApiOperation({ summary: 'Register a new customer user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  register(@Body() dto: RegisterUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT access token' })
  login(@Body() dto: LoginUserDto) {
    return this.commandBus.execute(new LoginUserCommand(dto));
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('otp/send')
  @ApiOperation({
    summary: 'Send 6-digit email OTP (CHECKOUT | REGISTER | PASSWORD_RESET)',
  })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.send(dto.email, dto.purpose, dto.firstName);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify email OTP code' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verify(dto.email, dto.purpose, dto.code);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('password/reset')
  @ApiOperation({ summary: 'Reset password with email OTP' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.identityService.resetPassword(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('guest-bootstrap')
  @ApiOperation({
    summary:
      'Guest checkout bootstrap — creates CUSTOMER for new email and returns JWT',
  })
  guestBootstrap(@Body() dto: GuestBootstrapDto) {
    return this.identityService.guestBootstrap(dto);
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

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update profile (name, phone, TC, personal + billing address)',
  })
  @Roles(
    Role.CUSTOMER,
    Role.PARTNER,
    Role.PARTNER_STAFF,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  updateProfile(
    @CurrentUser() user: UserPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.commandBus.execute(new UpdateProfileCommand(user.userId, dto));
  }

  @Post('profile/password')
  @ApiBearerAuth()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Change password (current + new)' })
  @Roles(
    Role.CUSTOMER,
    Role.PARTNER,
    Role.PARTNER_STAFF,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )
  changePassword(
    @CurrentUser() user: UserPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.commandBus.execute(new ChangePasswordCommand(user.userId, dto));
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
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
