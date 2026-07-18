import type { User } from '@turladur/shared-types';

import { apiRequest } from './api-client';

export type AuthTokens = {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;
};

export async function registerUser(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  return apiRequest<AuthTokens>('/identity/register', {
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
