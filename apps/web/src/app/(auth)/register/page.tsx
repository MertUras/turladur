'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { ApiError } from '@/services/api-client';
import { useAuth } from '@/providers/auth-provider';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      await register({
        email: String(form.get('email')),
        password: String(form.get('password')),
        firstName: String(form.get('firstName') || '') || undefined,
        lastName: String(form.get('lastName') || '') || undefined,
      });
      router.push('/tours');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kayıt başarısız oldu');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Kayıt ol</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Nest Identity — <code>/identity/register</code>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-neutral-700"
            >
              Ad
            </label>
            <input
              id="firstName"
              name="firstName"
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none ring-sky-500 focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-neutral-700"
            >
              Soyad
            </label>
            <input
              id="lastName"
              name="lastName"
              className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none ring-sky-500 focus:ring-2"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-700"
          >
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none ring-sky-500 focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-neutral-700"
          >
            Şifre (min 8, 1 büyük harf, 1 rakam)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none ring-sky-500 focus:ring-2"
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="h-11 w-full rounded-lg bg-sky-600 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {pending ? 'Kaydediliyor…' : 'Kayıt ol'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="font-medium text-sky-700">
          Giriş yap
        </Link>
      </p>
    </div>
  );
}
