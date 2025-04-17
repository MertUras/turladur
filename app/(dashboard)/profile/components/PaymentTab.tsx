'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CreditCardIcon, PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Card {
  id: number;
  type: string;
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  logo: string;
  lastFour: string;
  isExpired: boolean;
}

// Kart doğrulama fonksiyonları
const validateCardNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length === 16;
};

const validateExpiryDate = (date: string): { isValid: boolean; message?: string } => {
  const [month, year] = date.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  const cardYear = parseInt(year);
  const cardMonth = parseInt(month);

  if (cardMonth < 1 || cardMonth > 12) {
    return { isValid: false, message: 'Geçersiz ay' };
  }

  if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
    return { isValid: false, message: 'Kartın süresi dolmuş' };
  }

  return { isValid: true };
};

const validateCVV = (cvv: string): boolean => {
  return /^\d{3}$/.test(cvv);
};

const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  const groups = cleanValue.match(/.{1,4}/g) || [];
  return groups.join(' ').substr(0, 19);
};

const formatExpiryDate = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.substr(0, 2) + (cleanValue.length > 2 ? '/' + cleanValue.substr(2, 2) : '');
  }
  return cleanValue;
};

interface PaymentTabProps {
  savedCards: Card[];
  onSaveCard: (card: Omit<Card, 'id'>) => void;
  onDeleteCard: (cardId: number) => void;
  cardTypes: Array<{
    name: string;
    logo: string;
    pattern: RegExp;
    background: string;
  }>;
}

export default function PaymentTab({ savedCards, onSaveCard, onDeleteCard, cardTypes }: PaymentTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardType, setCardType] = useState('');

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
    // Kart numarası kontrolü
    if (!validateCardNumber(cardNumber)) {
      toast.error('Geçerli bir kart numarası giriniz (16 haneli)');
      return;
    }

    // Son kullanma tarihi kontrolü
    const expiryValidation = validateExpiryDate(expiryDate);
    if (!expiryValidation.isValid) {
      toast.error(expiryValidation.message || 'Geçersiz son kullanma tarihi');
      return;
    }

    // CVV kontrolü
    if (!validateCVV(cvv)) {
      toast.error('Geçerli bir CVV giriniz (3 haneli)');
      return;
    }

    // Kart sahibi kontrolü
    if (!cardName.trim()) {
      toast.error('Kart sahibinin adını giriniz');
      return;
    }

    const cleanNumber = cardNumber.replace(/\D/g, '');

    const newCard = {
      type: cardType,
      number: cleanNumber,
      name: cardName,
      expiry: expiryDate,
      cvv: cvv,
      logo: cardTypes.find(t => t.name === cardType)?.logo || '',
      lastFour: cleanNumber.slice(-4),
      isExpired: false
    };

    onSaveCard(newCard);
    
    // Form alanlarını temizle
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setCardType('');
    setIsCardFlipped(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ödeme Bilgileri</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 text-sm rounded-lg flex items-center ${
            isEditing 
              ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}
        >
          {isEditing ? (
            <>
              <span>İptal</span>
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Kart Ekle</span>
            </>
          )}
        </button>
      </div>
      
      {/* Kart ekleme formu */}
      {isEditing && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kart Numarası
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kart Üzerindeki İsim
              </label>
              <input
                type="text"
                value={cardName}
                onChange={handleCardNameChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="AD SOYAD"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Son Kullanma Tarihi
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="AA/YY"
                maxLength={5}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                onFocus={() => setIsCardFlipped(true)}
                onBlur={() => setIsCardFlipped(false)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="000"
                maxLength={3}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveCard}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Kartı Kaydet
            </button>
          </div>
        </div>
      )}
      
      {/* Kayıtlı kartlar */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Kayıtlı Kartlar</h3>
        
        {savedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CreditCardIcon className="h-12 w-12 mb-3" />
            <h3 className="text-lg font-medium">Henüz kayıtlı kartınız yok</h3>
            <p className="mt-1">Hızlı ödeme için kart ekleyebilirsiniz.</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Kart Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedCards.map((card) => (
              <div 
                key={card.id} 
                className={`relative rounded-lg overflow-hidden shadow-sm ${
                  card.isExpired ? 'opacity-70' : ''
                }`}
              >
                <div className={`p-4 bg-gradient-to-r ${
                  card.type === 'Visa' ? 'from-blue-500 to-blue-600' :
                  card.type === 'Mastercard' ? 'from-red-500 to-red-600' :
                  card.type === 'American Express' ? 'from-gray-600 to-gray-700' :
                  'from-orange-500 to-orange-600'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white text-xs opacity-80">Kart Numarası</p>
                      <p className="text-white font-mono mt-1">**** **** **** {card.lastFour}</p>
                    </div>
                    
                    <Image
                      src={card.logo}
                      alt={card.type}
                      width={50}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-white text-xs opacity-80">Kart Sahibi</p>
                      <p className="text-white font-mono mt-1">{card.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-white text-xs opacity-80">Son Kullanma</p>
                      <p className="text-white font-mono mt-1">{card.expiry}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white dark:bg-gray-800 flex justify-between items-center">
                  {card.isExpired ? (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 rounded-full">
                      Süresi Doldu
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300 rounded-full">
                      Aktif
                    </span>
                  )}
                  
                  <button
                    onClick={() => onDeleteCard(card.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Kartı Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Ödeme Geçmişi */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ödeme Geçmişi</h3>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Açıklama
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tutar
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  10.05.2024
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  Grand Hotel Antalya - Rezervasyon
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  2.500 ₺
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                    Başarılı
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  15.04.2024
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  Kapadokya Balon Turu - Rezervasyon
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  800 ₺
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                    Başarılı
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  02.03.2024
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  Blue Resort Fethiye - Rezervasyon
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  1.800 ₺
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                    Başarılı
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 