'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Keep email for context in success message if needed, or clear it
      // setEmail('');
    }, 1500);
  };

  return (
    <section className="py-24 md:py-32 bg-neutral-50 border-y border-neutral-200/60">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative h-80 md:h-[450px] w-full rounded-xl overflow-hidden shadow-lg border border-neutral-200/50 order-last lg:order-first">
            <Image
              src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1932&auto=format&fit=crop"
              alt="E-bülten Kayıt"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:pl-8">
            {submitted ? (
              <div className="text-center lg:text-left py-6 animate-fadeIn">
                <CheckCircleIcon className="w-10 h-10 text-emerald-500 mb-4 mx-auto lg:mx-0" />
                <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                  Teşekkürler!
                </h3>
                <p className="text-neutral-600 mb-4 text-sm">
                  <span className="font-medium text-neutral-800">{email}</span>{' '}
                  adresine özel fırsatları göndereceğiz.
                </p>
                <p className="text-neutral-600 mb-6 text-sm">
                  E-bültenimize başarıyla kaydoldunuz.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                    setError('');
                  }}
                  className="text-neutral-950 font-medium hover:text-neutral-800 transition-colors text-sm underline underline-offset-2"
                >
                  Farklı bir e-posta ile kaydol
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-neutral-100 rounded-full text-neutral-800 font-medium text-xs mb-6">
                  <EnvelopeIcon className="w-4 h-4 mr-1.5" />
                  Özel Fırsatlar
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  İndirimleri ve Haberleri Kaçırmayın
                </h2>
                <p className="text-lg text-neutral-600 mb-8">
                  E-posta listemize katılarak en yeni turlar, özel indirimler ve
                  seyahat ipuçlarından ilk siz haberdar olun.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email-newsletter" className="sr-only">
                      E-posta adresi
                    </label>
                    <input
                      id="email-newsletter"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full px-4 py-2.5 border rounded-lg ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-300' : 'border-neutral-300 focus:border-neutral-950 focus:ring-neutral-300'} text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm transition-colors bg-white`}
                      placeholder="E-posta adresiniz"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs mt-1">{error}</p>
                  )}

                  <div className="flex items-start pt-1">
                    <div className="flex items-center h-5">
                      <input
                        id="terms-newsletter"
                        name="terms-newsletter"
                        type="checkbox"
                        required
                        className="h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 focus:ring-offset-0"
                      />
                    </div>
                    <div className="ml-2.5 text-xs">
                      <label
                        htmlFor="terms-newsletter"
                        className="text-neutral-500"
                      >
                        <Link
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-neutral-950 hover:underline underline-offset-2"
                        >
                          Gizlilik Politikası
                        </Link>
                        'nı okudum ve kabul ediyorum.
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-3 bg-neutral-950 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 transition-colors font-medium rounded-lg shadow-sm disabled:opacity-60 text-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      'Bültene Kaydol'
                    )}
                  </button>
                </form>
                <p className="mt-4 text-xs text-neutral-500 text-left">
                  İstediğiniz zaman abonelikten çıkabilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
