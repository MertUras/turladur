import { apiRequest } from './api-client';

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(input: ContactMessageInput) {
  return apiRequest<{ ok?: boolean } | null>('/contact', {
    method: 'POST',
    body: input,
  });
}
