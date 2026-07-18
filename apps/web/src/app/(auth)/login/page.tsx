'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { ApiError } from '@/services/api-client';
import { useAuth } from '@/providers/auth-provider';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const user = await login(
        String(form.get('email')),
        String(form.get('password')),
      );
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else if (user.role === 'PARTNER' || user.role === 'PARTNER_STAFF') {
        router.push('/partner/dashboard');
      } else {
        router.push('/tours');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Giriş başarısız oldu');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Giriş yap</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Nest Identity — <code>/identity/login</code>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            Şifre
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
          {pending ? 'Giriş yapılıyor…' : 'Giriş yap'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        Hesabın yok mu?{' '}
        <Link href="/register" className="font-medium text-sky-700">
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}
