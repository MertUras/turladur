"use client"
import { useState } from 'react';
import Image from "next/image";

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Email validasyonu
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }
    
    // Yükleniyor durumunu başlat
    setLoading(true);
    
    // API çağrısını simüle et
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
    }, 1500);
  };
  
  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
      {/* Dekoratif arka plan elementleri */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-white opacity-10 rounded-full"></div>
        <div className="absolute right-1/4 bottom-0 w-40 h-40 bg-white opacity-5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Görsel kısmı */}
            <div className="md:w-2/5 relative h-60 md:h-auto w-full">
              <Image 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                alt="Tatil fırsatları"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center justify-center p-8 md:p-6">
                <div>
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">KAÇIRMA</span>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Size Özel Fırsatları<br />Kaçırmayın!</h3>
                  <p className="text-white/90 text-sm md:text-base">En iyi teklifler için e-bültenimize kaydolun.</p>
                </div>
              </div>
            </div>
            
            {/* Form kısmı */}
            <div className="md:w-3/5 p-6 md:p-10">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Teşekkürler!</h3>
                  <p className="text-gray-600 mb-6">E-bültenimize başarıyla kaydoldunuz. Size özel fırsatları içeren e-postalar almaya başlayacaksınız.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                  >
                    Farklı bir e-posta ile kaydol
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-gray-900 text-xl md:text-2xl font-bold mb-2">En Yeni Fırsatlardan İlk Siz Haberdar Olun</h3>
                  <p className="text-gray-600 mb-6">Haftalık bültenimize kaydolarak <span className="font-semibold">%15 indirim kuponu</span> kazanın ve özel fırsatları kaçırmayın.</p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`bg-gray-50 border ${error ? 'border-red-300' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3`}
                          placeholder="E-posta adresiniz"
                          required
                        />
                      </div>
                      
                      {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                      )}
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            type="checkbox"
                            required
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                          />
                        </div>
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                          <a href="/privacy-policy" className="text-blue-600 hover:underline">Gizlilik politikasını</a> okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
                        </label>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center px-5 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg transition-colors"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Gönderiliyor...
                          </>
                        ) : (
                          <>Kaydol</>
                        )}
                      </button>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        İstediğiniz zaman e-bültenden çıkabilirsiniz. Her e-postanın altındaki aboneliği iptal et bağlantısını kullanabilirsiniz.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 