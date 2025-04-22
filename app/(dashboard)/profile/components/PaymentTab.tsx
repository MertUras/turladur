'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { CreditCardIcon, PlusIcon, XMarkIcon, PencilSquareIcon, EllipsisVerticalIcon, ArrowDownTrayIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Card {
  id: number;
  type: string;
  brand: string;
  number: string;
  name: string;
  expiry: string;
  cvv?: string;
  logo: string;
  lastFour: string;
  isExpired: boolean;
  isDefault: boolean;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

// Kart doğrulama fonksiyonları
const validateCardNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0 && cleanNumber.length >= 13 && cleanNumber.length <= 19;
};

const validateExpiryDate = (date: string): { isValid: boolean; message?: string } => {
  if (!/^\d{2}\/\d{2}$/.test(date)) {
    return { isValid: false, message: 'Geçersiz tarih formatı (AA/YY)' };
  }
  const [month, year] = date.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  const cardYear = parseInt(year);
  const cardMonth = parseInt(month);

  if (cardMonth < 1 || cardMonth > 12) {
    return { isValid: false, message: 'Geçersiz ay (01-12)' };
  }

  if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
    return { isValid: false, message: 'Kartın süresi dolmuş' };
  }

  return { isValid: true };
};

const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const groups = cleanValue.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19);
};

const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 3) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
  }
  if (cleanValue.length >= 1) {
    return cleanValue.slice(0, 2);
  }
  return cleanValue;
};

// --- Dummy Data (Ensure these are available) ---
const visaLogo = '/payment/visa.webp'; 
const mastercardLogo = '/payment/mastercard.webp';

const dummySavedCards: Card[] = [
  {
    id: 1,
    type: 'Visa', brand: 'Visa',
    number: '4111111111111111', name: 'Hasan Mert Öğüt',
    expiry: '12/25', logo: visaLogo,
    lastFour: '1111', isExpired: false, isDefault: true,
  },
  {
    id: 2,
    type: 'Mastercard', brand: 'Mastercard',
    number: '5555555555554444', name: 'Hasan Mert Öğüt',
    expiry: '08/26', logo: mastercardLogo,
    lastFour: '4444', isExpired: false, isDefault: false,
  },
  {
    id: 3,
    type: 'Visa', brand: 'Visa',
    number: '4000000000009999', name: 'Hasan Mert Öğüt',
    expiry: '01/23', logo: visaLogo,
    lastFour: '9999', isExpired: true, isDefault: false,
  },
];

const dummyBillingHistory: BillingHistoryItem[] = [
  { id: 'INV-12345', date: '2024-07-15', description: 'Yıllık Abonelik Yenileme', amount: 1499.99, status: 'paid', invoiceUrl: '#' },
  { id: 'INV-12300', date: '2024-06-20', description: 'Ek Kullanıcı Lisansı', amount: 250.00, status: 'paid', invoiceUrl: '#' },
  { id: 'INV-12250', date: '2024-05-15', description: 'Aylık Kullanım Ücreti', amount: 149.99, status: 'failed', invoiceUrl: '#' },
  { id: 'INV-12199', date: '2024-04-15', description: 'Aylık Kullanım Ücreti', amount: 149.99, status: 'paid' },
];
// --- End Dummy Data ---

interface PaymentTabProps {
  savedCards: Card[];
  onSaveCard: (card: Omit<Card, 'id' | 'logo' | 'isExpired' | 'lastFour' | 'isDefault' | 'brand' | 'type'> & { brand: string, type: string }) => void;
  onDeleteCard: (cardId: number) => void;
  cardTypes: Array<{
    name: string;
    logo: string;
    pattern: RegExp;
    background: string;
  }>;
}

export default function PaymentTab({ savedCards: initialCards, onSaveCard, onDeleteCard, cardTypes }: PaymentTabProps) {
  const [savedCards, setSavedCards] = useState<Card[]>(initialCards || dummySavedCards);
  const billingHistory = dummyBillingHistory;
  
  const [isEditing, setIsEditing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardType, setCardType] = useState('');

  const [billingAddress, setBillingAddress] = useState({
    line1: 'İkas Genel Merkez', 
    line2: 'Teknopark İstanbul No:1/4A/201',
    city: 'Pendik', 
    state: 'İstanbul',
    postalCode: '34906',
    country: 'Türkiye', 
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const statusStyles = {
    paid: { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-200' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-200' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-200' },
  };

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    const foundType = cardTypes.find(type => type.pattern.test(cleanNumber));
    return foundType?.name || '';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value);
    const detectedType = detectCardType(value);
    setCardType(detectedType);
    
    if (value.length === 19 && !validateCardNumber(value)) {
      toast.error('Geçerli bir kart numarası giriniz (16 haneli)');
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatExpiryDate(e.target.value);
    setExpiryDate(value);
    
    if (value.length === 5) {
      const validation = validateExpiryDate(value);
      if (!validation.isValid) {
        toast.error(validation.message || 'Geçersiz son kullanma tarihi');
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 3);
    setCvv(value);
    
    if (value.length === 3 && !validateCVV(value)) {
      toast.error('Geçerli bir CVV giriniz (3 haneli)');
    }
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCardName(value);
    
    if (value.length > 0 && !value.trim()) {
      toast.error('Kart sahibinin adını giriniz');
    }
  };

  const handleSaveCard = () => {
    if (!validateCardNumber(cardNumber)) {
      toast.error('Geçerli bir kart numarası giriniz (16 haneli)');
      return;
    }

    const expiryValidation = validateExpiryDate(expiryDate);
    if (!expiryValidation.isValid) {
      toast.error(expiryValidation.message || 'Geçersiz son kullanma tarihi');
      return;
    }

    if (!validateCVV(cvv)) {
      toast.error('Geçerli bir CVV giriniz (3 haneli)');
      return;
    }

    if (!cardName.trim()) {
      toast.error('Kart sahibinin adını giriniz');
      return;
    }

    if (!cardType) return toast.error('Kart tipi algılanamadı');

    const cleanNumber = cardNumber.replace(/\D/g, '');
    const newCardData = {
      type: cardType,
      brand: cardType,
      number: cleanNumber,
      name: cardName,
      expiry: expiryDate,
      cvv: cvv,
    };

    onSaveCard(newCardData);
    
    toast.success(`${cardType} kartı başarıyla eklendi`);
    setIsEditing(false);
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setCardType('');
    setIsCardFlipped(false);
  };

  const handleDeleteCard = (cardId: number) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    onDeleteCard(cardId);
  };

  const handleSetDefault = (cardId: number) => {
    setSavedCards(prev => prev.map(card => (
      card.id === cardId 
        ? { ...card, isDefault: true } 
        : { ...card, isDefault: false }
    )));
    toast.success('Varsayılan kart güncellendi');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Ödeme ve Faturalandırma</h2>
        <p className="mt-1 text-sm text-neutral-600">Kayıtlı ödeme yöntemlerinizi yönetin, fatura adresinizi güncelleyin ve geçmiş faturalarınızı görüntüleyin.</p>
      </div>
      
      {isEditing && (
        <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-900 mb-4">Yeni Kart Ekle</h3>
          <form onSubmit={handleSaveCard} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            <div className="md:col-span-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Kart Numarası
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => setIsCardFlipped(false)}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm pr-10"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                />
                {cardType && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-neutral-400 font-medium">{cardType}</span> 
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Kart Üzerindeki İsim
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={cardName}
                onChange={handleCardNameChange}
                onFocus={() => setIsCardFlipped(false)}
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                placeholder="AD SOYAD"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Son Kul. Tarihi
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  onFocus={() => setIsCardFlipped(false)}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="AA/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  onFocus={() => setIsCardFlipped(true)}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="•••"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                İptal
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Kartı Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-base font-semibold text-neutral-900">Kayıtlı Kartlar</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Yeni Kart Ekle
            </button>
          )}
        </div>
        
        {savedCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedCards.map((card) => (
              <div 
                key={card.id} 
                className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col justify-between transition-all ${card.isDefault ? 'border-sky-300 ring-1 ring-sky-300' : 'border-neutral-200/50'} ${card.isExpired ? 'opacity-60 bg-neutral-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {card.logo ? (
                      <Image src={card.logo} alt={card.brand + ' logo'} width={36} height={24} className="object-contain" />
                    ) : (
                      <CreditCardIcon className="h-6 w-6 text-neutral-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{card.brand} <span className="text-neutral-500">•••• {card.lastFour}</span></p>
                      <p className={`text-xs ${card.isExpired ? 'text-red-600 font-medium' : 'text-neutral-500'}`}>
                        Son Kul. Tarihi: {card.expiry} {card.isExpired && "(Süresi Dolmuş)"}
                      </p>
                    </div>
                  </div>
                  {card.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200">
                      Varsayılan
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-neutral-600 mb-3">
                  {card.name}
                </div>

                <div className="border-t border-neutral-100 pt-3 flex items-center justify-end space-x-3 text-xs">
                  {!card.isDefault && !card.isExpired && (
                    <button 
                      onClick={() => handleSetDefault(card.id)}
                      className="font-medium text-neutral-600 hover:text-sky-700 transition-colors"
                    >
                      Varsayılan Yap
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      // Implement the logic to edit the card
                      console.log('Editing card:', card.id);
                    }}
                    className="font-medium text-neutral-600 hover:text-sky-700 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDeleteCard(card.id)}
                    className="font-medium text-red-600 hover:text-red-800 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 text-center py-6">Kayıtlı ödeme yöntemi bulunmuyor.</p>
        )}
      </div>
      
      <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-neutral-100 gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">Fatura Adresi</h3>
            <p className="mt-1 text-sm text-neutral-600">Faturalarınızın gönderileceği adres.</p>
          </div>
          <button
            onClick={() => {
              // Implement the logic to edit the address
              console.log('Editing address');
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 text-xs font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" />
            Düzenle
          </button>
        </div>
        
        <div className="p-5">
          <address className="text-sm text-neutral-700 not-italic space-y-1">
            <p className="font-medium">İkas Genel Merkez</p>
            <p>Teknopark İstanbul No:1/4A/201</p>
            <p>Pendik, İstanbul</p>
            <p>34906</p>
            <p>Türkiye</p>
          </address>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="text-base font-semibold text-neutral-900">Fatura Geçmişi</h3>
          <p className="mt-1 text-sm text-neutral-600">Geçmiş ödemelerinizi ve faturalarınızı görüntüleyin.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tarih</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Açıklama</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tutar</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Durum</th>
                <th scope="col" className="relative px-5 py-3">
                  <span className="sr-only">İndir</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {billingHistory.map((item: BillingHistoryItem) => {
                const style = statusStyles[item.status];
                return (
                  <tr key={item.id}>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-600">{new Intl.DateTimeFormat('tr-TR').format(new Date(item.date))}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">{item.description}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-neutral-700">{item.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${style.bg} ${style.text} ring-1 ring-inset ${style.ring}`}>
                        {item.status === 'paid' ? 'Ödendi' : item.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.invoiceUrl && (
                        <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800 inline-flex items-center group">
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1 text-sky-500 group-hover:text-sky-700" />
                          İndir
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
              {billingHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-neutral-500">Fatura geçmişi bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 