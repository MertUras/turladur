"use client"
import { useState } from 'react';
import Image from "next/image";
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Success icon

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
    // Section background changed to white, removed gradient and shapes
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Removed the inner white card container, using grid layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Görsel kısmı - Simplified */}
          <div className="relative h-80 md:h-full w-full min-h-[400px]">
            <Image 
              // Using a different, potentially more relevant image
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
              alt="E-bülten Kayıt"
              fill
              className="object-cover rounded-lg" // Added subtle rounding to image
            />
            {/* Removed text overlay from image */}
          </div>
          
          {/* Form kısmı - Restyled */}
          <div className="p-4 md:p-0">
            {submitted ? (
              // Simplified Success State
              <div className="text-left py-6">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Teşekkürler!</h3>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">{email}</span> adresine özel fırsatları göndereceğiz.
                </p>
                <p className="text-gray-600 mb-6">E-bültenimize başarıyla kaydoldunuz.</p>
                <button 
                  onClick={() => { setSubmitted(false); setEmail(''); setError(''); }} // Reset state
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm"
                >
                  Farklı bir e-posta ile kaydol
                </button>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6">
                  Özel Fırsatlar
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  İndirimleri ve Haberleri Kaçırmayın
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  E-posta listemize katılarak en yeni turlar, özel indirimler ve seyahat ipuçlarından ilk siz haberdar olun.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email-newsletter" className="sr-only">E-posta adresi</label>
                    <input
                      id="email-newsletter"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      // Simplified input style
                      className={`block w-full border-0 border-b-2 ${error ? 'border-red-400 focus:border-red-600' : 'border-gray-200 focus:border-indigo-600'} p-3 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm transition-colors bg-transparent`}
                      placeholder="E-posta adresiniz"
                      required
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-600 text-sm -mt-2">{error}</p>
                  )}
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms-newsletter"
                        name="terms-newsletter"
                        type="checkbox"
                        required
                        // Simplified checkbox style
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms-newsletter" className="text-gray-500">
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:underline">Gizlilik Politikası</a>'nı kabul ediyorum.
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    // Styled like Testimonials CTA button
                    className="w-full flex items-center justify-center px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium rounded-md shadow-sm disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Bültene Kaydol'
                    )}
                  </button>
                </form>
                <p className="mt-4 text-xs text-gray-500 text-left">
                  İstediğiniz zaman abonelikten çıkabilirsiniz.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 