import type { User } from '@turta/shared-types';

import { apiRequest } from './api-client';

export type AuthTokens = {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  identityNumber?: string | null;
  birthDate?: string | null;
  address?: string | null;
  billingLine1?: string | null;
  billingLine2?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingPostalCode?: string | null;
  billingCountry?: string | null;
};

export async function registerUser(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  identityNumber: string;
  address: string;
  otpCode: string;
}) {
  return apiRequest<AuthTokens>('/identity/register', {
    method: 'POST',
    body: input,
  });
}

export type OtpPurpose = 'CHECKOUT' | 'REGISTER' | 'PASSWORD_RESET';

export type SendOtpResult = {
  email: string;
  purpose: OtpPurpose;
  expiresInSeconds: number;
  resendCooldownSeconds: number;
  debugCode?: string;
};

export async function sendEmailOtp(input: {
  email: string;
  purpose: OtpPurpose;
  firstName?: string;
}) {
  return apiRequest<SendOtpResult>('/identity/otp/send', {
    method: 'POST',
    body: input,
  });
}

export async function verifyEmailOtp(input: {
  email: string;
  purpose: OtpPurpose;
  code: string;
}) {
  return apiRequest<{ verified: boolean; email: string; purpose: OtpPurpose }>(
    '/identity/otp/verify',
    {
      method: 'POST',
      body: input,
    },
  );
}

export async function resetPasswordWithOtp(input: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return apiRequest<{ reset: boolean }>('/identity/password/reset', {
    method: 'POST',
    body: input,
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return apiRequest<AuthTokens>('/identity/login', {
    method: 'POST',
    body: input,
  });
}

export async function getProfile(token: string) {
  return apiRequest<User>('/identity/profile', { token });
}

export async function updateProfile(input: UpdateProfileInput, token: string) {
  return apiRequest<User>('/identity/profile', {
    method: 'PATCH',
    body: input,
    token,
  });
}

export async function changePassword(
  input: { currentPassword: string; newPassword: string },
  token: string,
) {
  return apiRequest<{ updated: boolean }>('/identity/profile/password', {
    method: 'POST',
    body: input,
    token,
  });
}

export type GuestBootstrapInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  billingLine1: string;
  billingCity: string;
  billingCountry?: string;
  identityNumber: string;
};

export async function guestBootstrap(input: GuestBootstrapInput) {
  return apiRequest<AuthTokens>('/identity/guest-bootstrap', {
    method: 'POST',
    body: input,
  });
}

export type RegisterPartnerInput = {
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  password: string;
  taxNumber?: string;
  firstName?: string;
  lastName?: string;
};

export type RegisterPartnerResult = {
  partner: {
    id: string;
    companyName: string;
    status: string;
    contactEmail: string;
  };
  user?: {
    id: string;
    email: string;
    role: string;
  };
  message?: string;
};

export async function registerPartner(input: RegisterPartnerInput) {
  return apiRequest<RegisterPartnerResult>('/identity/partners/register', {
    method: 'POST',
    body: input,
  });
}

export async function verifyPartner(token: string) {
  return apiRequest<{
    id: string;
    status: string;
    companyName?: string;
    contactEmail?: string;
  }>('/identity/partners/verify', {
    method: 'POST',
    body: { token },
  });
}
