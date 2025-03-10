'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BookingSteps } from '@/components/booking/BookingSteps';
import { DatePicker } from '@/components/booking/DatePicker';
import { 
  CreditCardIcon, UserIcon, 
  CheckCircleIcon, ChevronRightIcon, ChevronLeftIcon,
  BuildingOfficeIcon, UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

// Adım tipi
type StepStatus = 'complete' | 'current' | 'upcoming';

interface Step {
  id: string;
  name: string;
  description: string;
  status: StepStatus;
}

// Adımlar
const initialSteps: Step[] = [
  { id: '01', name: 'Tarih Seçimi', description: 'Giriş ve çıkış tarihlerinizi seçin', status: 'current' },
  { id: '02', name: 'Misafir Bilgileri', description: 'Kişisel bilgilerinizi girin', status: 'upcoming' },
  { id: '03', name: 'Ödeme', description: 'Güvenli ödeme yapın', status: 'upcoming' },
];

// Örnek otel ve oda verileri
const sampleHotel = {
  id: 'sample-hotel',
  name: 'Grand Hotel İstanbul',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  location: 'İstanbul, Türkiye',
  stars: 5
};

const sampleRoom = {
  id: 'sample-room',
  name: 'Deluxe Deniz Manzaralı Oda',
  price: 2500,
  capacity: 2,
  image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSteps, setActiveSteps] = useState<Step[]>(initialSteps);
  
  // Form verileri
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Adımları güncelle
  useEffect(() => {
    const updatedSteps = initialSteps.map((step, index) => ({
      ...step,
      status: index < currentStep 
        ? 'complete' as const
        : index === currentStep 
          ? 'current' as const
          : 'upcoming' as const
    }));
    setActiveSteps(updatedSteps);
  }, [currentStep]);
  
  // Giriş tarihi değiştiğinde çıkış tarihini sıfırla
  useEffect(() => {
    // Eğer çıkış tarihi seçilmişse ve giriş tarihinden önce veya aynı ise
    if (checkOut && checkOut <= checkIn) {
      setCheckOut(''); // Çıkış tarihini sıfırla
    }
  }, [checkIn, checkOut]);
  
  // Tarih formatını düzenle
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Tarih string'ini parçalara ayır (YYYY-MM-DD)
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Yeni bir tarih oluştur (saat dilimi sorunlarını önlemek için)
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Toplam gün sayısını hesapla
  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    
    // Tarih string'lerini parçalara ayır (YYYY-MM-DD)
    const [checkInYear, checkInMonth, checkInDay] = checkIn.split('-').map(Number);
    const [checkOutYear, checkOutMonth, checkOutDay] = checkOut.split('-').map(Number);
    
    // Yeni tarihler oluştur (saat dilimi sorunlarını önlemek için)
    const start = new Date(checkInYear, checkInMonth - 1, checkInDay);
    const end = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
    
    // Milisaniye cinsinden farkı hesapla
    const diffTime = Math.abs(end.getTime() - start.getTime());
    // Gün sayısına çevir
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Toplam fiyatı hesapla
  const calculateTotal = () => {
    const days = calculateDays();
    return days * sampleRoom.price;
  };
  
  // Rezervasyonu tamamla
  const completeBooking = () => {
    router.push('/booking/success');
  };
  
  // Minimum tarih (bugün)
  const today = new Date().toISOString().split('T')[0];
  
  // Minimum çıkış tarihi (giriş tarihinden bir gün sonra)
  const minCheckOut = checkIn 
    ? (() => {
        // Tarih string'ini parçalara ayır (YYYY-MM-DD)
        const [year, month, day] = checkIn.split('-').map(Number);
        
        // Giriş tarihinden bir gün sonrasını hesapla
        const nextDay = new Date(year, month - 1, day + 1);
        
        // YYYY-MM-DD formatına çevir
        return nextDay.toISOString().split('T')[0];
      })()
    : today;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">Rezervasyon</h1>
            <p className="text-xl text-gray-600">
              Sadece birkaç adımda rezervasyonunuzu tamamlayın
            </p>
          </div>

          {/* Adımlar */}
          <div className="mb-12">
            <BookingSteps steps={activeSteps} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ana içerik */}
            <div className="lg:col-span-2">
              {currentStep === 0 && (
                <div className="bg-white shadow-xl rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tarih Seçimi</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DatePicker
                        label="Giriş Tarihi"
                        value={checkIn}
                        onChange={setCheckIn}
                        minDate={today}
                        placeholder="Giriş tarihi seçin"
                      />
                      
                      <DatePicker
                        label="Çıkış Tarihi"
                        value={checkOut}
                        onChange={setCheckOut}
                        minDate={minCheckOut}
                        disabled={!checkIn}
                        placeholder="Çıkış tarihi seçin"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                        Misafir Sayısı
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="guests"
                          name="guests"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="block w-full pl-10 py-3 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Misafir' : 'Misafir'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {checkIn && checkOut && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800">Seçilen Tarihler</p>
                            <p className="text-lg font-semibold text-blue-900">
                              {formatDate(checkIn)} - {formatDate(checkOut)}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                              {calculateDays()} gece konaklama
                            </p>
                          </div>
                          <CheckCircleIcon className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      disabled={!checkIn || !checkOut}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Devam Et
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="bg-white shadow-xl rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Misafir Bilgileri</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Ad
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Adınız"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Soyad
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Soyadınız"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="+90 555 123 4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700 mb-2">
                        Özel İstekler <span className="text-gray-500 text-xs">(İsteğe bağlı)</span>
                      </label>
                      <textarea
                        name="special-requests"
                        id="special-requests"
                        rows={4}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <ChevronLeftIcon className="mr-2 h-5 w-5" />
                      Geri
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!firstName || !lastName || !email || !phone}
                      className="flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Devam Et
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white shadow-xl rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Bilgileri</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-2">
                        Kart Numarası
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCardIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="card-number"
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className="block w-full pl-10 py-3 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                          Son Kullanma Tarihi
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          id="expiry"
                          placeholder="MM/YY"
                          className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cvc"
                          id="cvc"
                          placeholder="123"
                          className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700 mb-2">
                        Kart Üzerindeki İsim
                      </label>
                      <input
                        type="text"
                        name="name-on-card"
                        id="name-on-card"
                        placeholder="Kart üzerindeki isim"
                        className="block w-full py-3 px-4 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme Özeti</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-gray-600">{sampleRoom.name}</p>
                          <p className="text-gray-900">{sampleRoom.price.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        
                        <div className="flex justify-between">
                          <p className="text-gray-600">{calculateDays()} gece</p>
                          <p className="text-gray-900">x {calculateDays()}</p>
                        </div>
                        
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                          <p className="text-lg font-medium text-gray-900">Toplam</p>
                          <p className="text-lg font-bold text-blue-600">{calculateTotal().toLocaleString('tr-TR')} ₺</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <ChevronLeftIcon className="mr-2 h-5 w-5" />
                      Geri
                    </button>
                    
                    <button
                      type="button"
                      onClick={completeBooking}
                      className="flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Rezervasyonu Tamamla
                      <CheckCircleIcon className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Yan panel - Rezervasyon özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-xl rounded-xl overflow-hidden sticky top-8">
                {/* Otel Resmi */}
                <div className="relative h-48">
                  <Image
                    src={sampleHotel.image}
                    alt={sampleHotel.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white">{sampleHotel.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(sampleHotel.stars)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Detaylar */}
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Konum</p>
                      <p className="text-gray-600">{sampleHotel.location}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{sampleRoom.name}</h4>
                    <div className="flex items-center space-x-3 mb-4">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-600">{sampleRoom.capacity} Kişilik</p>
                    </div>
                    
                    {checkIn && checkOut && (
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-3">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Giriş Tarihi</p>
                            <p className="text-gray-600">{formatDate(checkIn)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Çıkış Tarihi</p>
                            <p className="text-gray-600">{formatDate(checkOut)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <UserGroupIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Misafir Sayısı</p>
                            <p className="text-gray-600">{guests} Kişi</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {checkIn && checkOut && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Oda Fiyatı (Gecelik)</p>
                        <p className="text-gray-900">{sampleRoom.price.toLocaleString('tr-TR')} ₺</p>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Konaklama</p>
                        <p className="text-gray-900">{calculateDays()} Gece</p>
                      </div>
                      
                      <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                        <p className="text-lg font-medium text-gray-900">Toplam</p>
                        <p className="text-lg font-bold text-blue-600">{calculateTotal().toLocaleString('tr-TR')} ₺</p>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-1">Vergiler dahildir</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 