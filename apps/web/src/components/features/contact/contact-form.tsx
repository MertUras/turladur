'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail as EnvelopeIcon } from 'lucide-react';
import { sendContactMessage } from '@/services/contact';

const fieldClass =
  'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950/15';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    try {
      await sendContactMessage({ name, email, phone, subject, message });
      setStatus('ok');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Ad Soyad
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="Ad Soyad"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            E-posta Adresiniz
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="email@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Telefon <span className="text-neutral-400">(Opsiyonel)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder="+90 5XX XXX XX XX"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Konu
          </label>
          <select
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={fieldClass}
            required
          >
            <option value="">Konu Seçiniz</option>
            <option value="reservation">Rezervasyon</option>
            <option value="cancellation">İptal & İade</option>
            <option value="support">Teknik Destek</option>
            <option value="partnership">İş Ortaklığı</option>
            <option value="other">Diğer</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={fieldClass}
          placeholder="Mesajınızı detaylı bir şekilde yazınız..."
          required
        />
      </div>

      <div className="flex items-start pt-1">
        <input
          id="privacy"
          name="privacy"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
          required
        />
        <label htmlFor="privacy" className="ml-2.5 text-sm text-neutral-600">
          Kişisel verilerimin işlenmesine ilişkin{' '}
          <Link
            href="/privacy-policy"
            className="font-medium text-neutral-950 underline-offset-2 hover:underline"
          >
            aydınlatma metnini
          </Link>{' '}
          okudum ve kabul ediyorum.
        </label>
      </div>

      {status === 'ok' ? (
        <p className="rounded-lg bg-neutral-100 px-3 py-2 text-sm text-neutral-800">
          Mesajınız alındı. En kısa sürede dönüş yapacağız.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Mesaj gönderilemedi. Lütfen tekrar deneyin.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60"
      >
        <EnvelopeIcon className="mr-2 h-5 w-5" />
        {submitting ? 'Gönderiliyor…' : 'Mesajı Gönder'}
      </button>
    </form>
  );
}
