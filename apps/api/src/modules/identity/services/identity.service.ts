import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@turladur/shared-constants';
import type { User as SharedUser } from '@turladur/shared-types';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { JwtPayload } from '../../../core/auth/types/auth.types';
import { PrismaService } from '../../../core/database/prisma.service';
import { EmailQueueService } from '../../../core/queue/email-queue.service';
import { UserRole, Prisma } from '../../../generated/prisma';
import { PartnerRegisteredEvent } from '../events/partner-registered.event';
import { PartnerVerifiedEvent } from '../events/partner-verified.event';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterPartnerDto } from '../dto/register-partner.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { isValidTckn } from '../../../shared/utils/tckn';
import { BusinessException } from '../../../shared/exceptions/business.exception';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class IdentityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly emailQueue: EmailQueueService,
  ) {}

  async register(dto: RegisterUserDto) {
    await this.ensureEmailAvailable(dto.email);

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: UserRole.CUSTOMER,
      },
    });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(user.id, user.email, user.role),
    );

    await this.emailQueue.enqueue({
      to: user.email,
      template: 'welcome',
      data: { name: user.firstName ?? user.email },
    });

    const tokens = await this.issueTokens({
      sub: user.id,
      role: Role.CUSTOMER,
    });

    return {
      success: true,
      data: {
        ...tokens,
        user: this.toSharedUser(user),
      },
      error: null,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase().trim(),
        deletedAt: null,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Email veya şifre hatalı',
      });
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Email veya şifre hatalı',
      });
    }

    const role = this.mapRole(user.role);
    const tokens = await this.issueTokens({
      sub: user.id,
      role,
      partnerId: user.partnerId ?? undefined,
    });

    return {
      success: true,
      data: {
        ...tokens,
        user: this.toSharedUser(user),
      },
      error: null,
    };
  }

  /**
   * Guest checkout: create a CUSTOMER for a new email and issue JWT.
   * If email already exists, client must login (no silent takeover).
   */
  async guestBootstrap(dto: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    billingLine1: string;
    billingCity: string;
    billingCountry?: string;
    identityNumber: string;
  }) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message:
          'Bu e-posta ile kayıtlı bir hesap var. Devam etmek için giriş yapın.',
      });
    }

    if (!isValidTckn(dto.identityNumber)) {
      throw new BusinessException(
        'INVALID_IDENTITY_NUMBER',
        'TC Kimlik No geçersiz',
      );
    }

    const passwordHash = await bcrypt.hash(randomUUID(), BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone.trim(),
        address: dto.address.trim(),
        billingLine1: dto.billingLine1.trim(),
        billingCity: dto.billingCity.trim(),
        billingCountry: dto.billingCountry?.trim() || 'Türkiye',
        identityNumber: dto.identityNumber.trim(),
        role: UserRole.CUSTOMER,
      },
    });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(user.id, user.email, user.role),
    );

    const tokens = await this.issueTokens({
      sub: user.id,
      role: Role.CUSTOMER,
    });

    return {
      success: true,
      data: {
        ...tokens,
        user: this.toSharedUser(user),
      },
      error: null,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Kullanıcı bulunamadı',
      });
    }

    return {
      success: true,
      data: this.toSharedUser(user),
      error: null,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.requireUser(userId);

    if (dto.identityNumber != null && dto.identityNumber !== '') {
      if (!isValidTckn(dto.identityNumber)) {
        throw new BusinessException(
          'INVALID_IDENTITY_NUMBER',
          'TC Kimlik No geçersiz',
        );
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined
          ? { firstName: dto.firstName.trim() }
          : {}),
        ...(dto.lastName !== undefined
          ? { lastName: dto.lastName.trim() }
          : {}),
        ...(dto.phone !== undefined
          ? { phone: dto.phone?.trim() || null }
          : {}),
        ...(dto.identityNumber !== undefined
          ? {
              identityNumber:
                dto.identityNumber === '' || dto.identityNumber == null
                  ? null
                  : dto.identityNumber,
            }
          : {}),
        ...(dto.birthDate !== undefined
          ? {
              birthDate:
                dto.birthDate === '' || dto.birthDate == null
                  ? null
                  : new Date(dto.birthDate),
            }
          : {}),
        ...(dto.address !== undefined
          ? { address: dto.address?.trim() || null }
          : {}),
        ...(dto.billingLine1 !== undefined
          ? { billingLine1: dto.billingLine1?.trim() || null }
          : {}),
        ...(dto.billingLine2 !== undefined
          ? { billingLine2: dto.billingLine2?.trim() || null }
          : {}),
        ...(dto.billingCity !== undefined
          ? { billingCity: dto.billingCity?.trim() || null }
          : {}),
        ...(dto.billingState !== undefined
          ? { billingState: dto.billingState?.trim() || null }
          : {}),
        ...(dto.billingPostalCode !== undefined
          ? { billingPostalCode: dto.billingPostalCode?.trim() || null }
          : {}),
        ...(dto.billingCountry !== undefined
          ? { billingCountry: dto.billingCountry?.trim() || null }
          : {}),
      },
    });

    return {
      success: true,
      data: this.toSharedUser(updated),
      error: null,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.requireUser(userId);

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException({
        code: 'INVALID_CURRENT_PASSWORD',
        message: 'Mevcut şifre hatalı',
      });
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BusinessException(
        'PASSWORD_UNCHANGED',
        'Yeni şifre mevcut şifre ile aynı olamaz',
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      success: true,
      data: { updated: true },
      error: null,
    };
  }

  async registerPartner(dto: RegisterPartnerDto) {
    await this.ensureEmailAvailable(dto.contactEmail);

    const verificationToken = randomUUID();
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const result = await this.prisma.$transaction(async (tx) => {
      const partner = await tx.partner.create({
        data: {
          companyName: dto.companyName.trim(),
          taxNumber: dto.taxNumber,
          contactEmail: dto.contactEmail.toLowerCase().trim(),
          contactPhone: dto.contactPhone,
          verificationToken,
        },
      });

      const user = await tx.user.create({
        data: {
          email: partner.contactEmail,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.contactPhone,
          role: UserRole.PARTNER,
          partnerId: partner.id,
        },
      });

      return { partner, user };
    });

    this.eventEmitter.emit(
      'partner.registered',
      new PartnerRegisteredEvent(
        result.partner.id,
        result.user.id,
        result.partner.contactEmail,
        verificationToken,
      ),
    );

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(
        result.user.id,
        result.user.email,
        result.user.role,
      ),
    );

    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    await this.emailQueue.enqueue({
      to: result.partner.contactEmail,
      template: 'partner-verify',
      data: {
        companyName: result.partner.companyName,
        verifyUrl: `${frontendUrl}/partner-verification/verify?token=${verificationToken}`,
        token: verificationToken,
      },
    });

    const tokens = await this.issueTokens({
      sub: result.user.id,
      role: Role.PARTNER,
      partnerId: result.partner.id,
    });

    return {
      success: true,
      data: {
        ...tokens,
        partner: {
          id: result.partner.id,
          companyName: result.partner.companyName,
          status: result.partner.status,
          contactEmail: result.partner.contactEmail,
        },
        user: this.toSharedUser(result.user),
        message: 'Partner kaydı oluşturuldu. Doğrulama e-postası gönderildi.',
      },
      error: null,
    };
  }

  async verifyPartner(token: string) {
    const partner = await this.prisma.partner.findFirst({
      where: {
        verificationToken: token,
        deletedAt: null,
      },
    });

    if (!partner) {
      throw new NotFoundException({
        code: 'INVALID_VERIFICATION_TOKEN',
        message: 'Doğrulama tokenı geçersiz veya süresi dolmuş',
      });
    }

    const updated = await this.prisma.partner.update({
      where: { id: partner.id },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
        verificationToken: null,
      },
    });

    this.eventEmitter.emit(
      'partner.verified',
      new PartnerVerifiedEvent(updated.id, updated.contactEmail),
    );

    return {
      success: true,
      data: {
        id: updated.id,
        companyName: updated.companyName,
        status: updated.status,
        verifiedAt: updated.verifiedAt?.toISOString() ?? null,
      },
      error: null,
    };
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existing = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Bu e-posta adresi zaten kayıtlı',
      });
    }
  }

  private async requireUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Kullanıcı bulunamadı',
      });
    }
    return user;
  }

  private async issueTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      tokenType: 'Bearer' as const,
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
    };
  }

  private mapRole(role: UserRole): Role {
    return Role[role as keyof typeof Role] ?? Role.CUSTOMER;
  }

  private toSharedUser(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    identityNumber?: string | null;
    birthDate?: Date | null;
    address?: string | null;
    billingLine1?: string | null;
    billingLine2?: string | null;
    billingCity?: string | null;
    billingState?: string | null;
    billingPostalCode?: string | null;
    billingCountry?: string | null;
    role: UserRole;
    partnerId: string | null;
    permissions?: Prisma.JsonValue | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): SharedUser {
    const permissions =
      user.permissions &&
      typeof user.permissions === 'object' &&
      !Array.isArray(user.permissions)
        ? (user.permissions as SharedUser['permissions'])
        : null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      identityNumber: user.identityNumber ?? null,
      birthDate: user.birthDate
        ? user.birthDate.toISOString().slice(0, 10)
        : null,
      address: user.address ?? null,
      billingLine1: user.billingLine1 ?? null,
      billingLine2: user.billingLine2 ?? null,
      billingCity: user.billingCity ?? null,
      billingState: user.billingState ?? null,
      billingPostalCode: user.billingPostalCode ?? null,
      billingCountry: user.billingCountry ?? null,
      role: user.role,
      partnerId: user.partnerId,
      permissions,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
