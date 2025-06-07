import React, { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { DatePicker } from '../../components/booking/DatePicker';
import PickupPointForm from './PickupPointForm';

interface ImageFile {
  url: string;
  file: File | null;
  preview?: string;
}

interface AgeRange {
  minAge: number;
  maxAge: number | null;
  pricingType: 'free' | 'half' | 'percentage' | 'fixed';
  value: number;
}

interface TourDate {
  startDate: string;
  endDate: string;
  price: string;
  availableSeats: string;
  soldSeats: number;
  waitingList: number;
  discount: number;
  minParticipants: string;
  maxParticipants: string;
  earlyBirdDiscount: number;
  lastMinuteDiscount: number;
  earlyBirdDeadline: string;
  lastMinuteStart: string;
  notes: string;
  status: 'ACTIVE' | 'FULL' | 'CANCELLED' | 'COMPLETED' | 'WAITING_LIST' | 'NOT_ENOUGH_PARTICIPANTS';
  ageRanges: AgeRange[];
}

interface PickupPoint {
  id?: string;
  city: string;
  location: string;
  time: string;
  description?: string;
  order: number;
  isActive: boolean;
}

interface Destination {
  city: string;
  description?: string;
}

export interface TourFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  duration: string;
  nights: string;
  maxParticipants: number;
  currentParticipants: number;
  images: ImageFile[];
  includes: string[];
  excludes: string[];
  itinerary: { title: string; description: string }[];
  status: 'active' | 'draft' | 'archived';
  departureCity: string;
  region: string;
  transportation: string;
  period: string;
  tourType: string;
  accommodationType: string;
  difficultyLevel: string;
  ageRestriction: number;
  languages: string[];
  tags: string[];
  tourDates: TourDate[];
  discount: number;
  destinations: Destination[];
  reviews: number;
  isJointTour: boolean;
  features: string[];
  startDate: string;
  endDate: string;
  accommodationName: string;
  meetingPoint: string;
  meetingTime: string;
  pickupPoints: PickupPoint[];
}

interface TourFormProps {
  initialData?: {
    name?: string;
    description?: string;
    price?: number;
    departureCity?: string;
    duration?: number;
    maxParticipants?: number;
    currentParticipants?: number;
    images?: string[];
    inclusions?: string[];
    exclusions?: string[];
    itinerary?: { title: string; description: string }[];
    featured?: boolean;
    region?: string;
    transportation?: string;
    period?: string;
    tourType?: string;
    accommodationType?: string;
    difficultyLevel?: string;
    ageRestriction?: number;
    languages?: string[];
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    discount?: number;
    destinations?: string[];
    reviews?: number;
    isJointTour?: boolean;
    features?: string[];
    tourDates?: { startDate: string; endDate: string }[];
    meetingPoint?: string;
    meetingTime?: string;
    pickupPoints?: PickupPoint[];
    nights?: string;
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  currentStep?: 'basic' | 'details';
  partnerId?: string;
}

const defaultFormData: TourFormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  duration: '',
  nights: '',
  maxParticipants: 0,
  currentParticipants: 0,
  images: [],
  includes: [],
  excludes: [],
  itinerary: [],
  status: 'draft',
  departureCity: '',
  region: '',
  transportation: '',
  period: '',
  tourType: '',
  accommodationType: '',
  difficultyLevel: '',
  ageRestriction: 0,
  languages: [],
  tags: [],
  tourDates: [{
    startDate: '',
    endDate: '',
    price: '',
    availableSeats: '',
    soldSeats: 0,
    waitingList: 0,
    discount: 0,
    minParticipants: '',
    maxParticipants: '',
    earlyBirdDiscount: 0,
    lastMinuteDiscount: 0,
    earlyBirdDeadline: '',
    lastMinuteStart: '',
    notes: '',
    status: 'ACTIVE',
    ageRanges: []
  }],
  discount: 0,
  destinations: [],
  reviews: 0,
  isJointTour: false,
  features: [],
  startDate: '',
  endDate: '',
  accommodationName: '',
  meetingPoint: '',
  meetingTime: '',
  pickupPoints: []
};

export default function TourForm({ initialData, onSubmit, isSubmitting: externalIsSubmitting = false, currentStep: initialStep = 'basic', partnerId }: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>(() => {
    if (initialData) {
      const tourDates = initialData.tourDates?.map((date: any) => ({
        startDate: date.startDate || '',
        endDate: date.endDate || '',
        price: date.price?.toString() || '0',
        availableSeats: date.availableSeats?.toString() || '0',
        soldSeats: date.soldSeats || 0,
        waitingList: date.waitingList || 0,
        discount: date.discount || 0,
        minParticipants: date.minParticipants?.toString() || '',
        maxParticipants: date.maxParticipants?.toString() || '',
        earlyBirdDiscount: date.earlyBirdDiscount || 0,
        lastMinuteDiscount: date.lastMinuteDiscount || 0,
        earlyBirdDeadline: date.earlyBirdDeadline || '',
        lastMinuteStart: date.lastMinuteStart || '',
        notes: date.notes || '',
        status: date.status || 'ACTIVE',
        ageRanges: date.ageRanges || []
      })) || [defaultFormData.tourDates[0]];

      return {
        ...defaultFormData,
        title: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        location: initialData.departureCity || '',
        duration: initialData.duration?.toString() || '',
        maxParticipants: initialData.maxParticipants || 0,
        currentParticipants: initialData.currentParticipants || 0,
        images: initialData.images?.map((url: string) => ({ url, file: null, preview: url })) || [],
        includes: initialData.inclusions || [],
        excludes: initialData.exclusions || [],
        itinerary: initialData.itinerary || [],
        status: initialData.featured ? 'active' : 'draft',
        departureCity: initialData.departureCity || '',
        region: initialData.region || '',
        transportation: initialData.transportation || '',
        period: initialData.period || '',
        tourType: initialData.tourType || '',
        accommodationType: initialData.accommodationType || '',
        difficultyLevel: initialData.difficultyLevel || '',
        ageRestriction: initialData.ageRestriction || 0,
        languages: initialData.languages || [],
        tags: initialData.tags || [],
        tourDates,
        discount: initialData.discount || 0,
        destinations: initialData.destinations?.map((dest: any) => ({
          city: dest.city || '',
          description: dest.description || ''
        })) || [],
        reviews: initialData.reviews || 0,
        isJointTour: initialData.isJointTour || false,
        features: initialData.features || [],
        startDate: initialData.startDate?.toISOString().split('T')[0] || '',
        endDate: initialData.endDate?.toISOString().split('T')[0] || '',
        accommodationName: '',
        meetingPoint: initialData.meetingPoint || '',
        meetingTime: initialData.meetingTime || '',
        pickupPoints: initialData.pickupPoints || [],
        nights: initialData.nights?.toString() || ''
      };
    }
    return defaultFormData;
  });
  const [step, setStep] = useState(initialStep);
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof TourFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validasyon hatalarını konsola yazdır
  const logValidationErrors = (errors: Partial<Record<keyof TourFormData, string>>) => {
    console.log('Validasyon Hataları:', errors);
    // Her bir hata için detaylı log
    Object.entries(errors).forEach(([field, error]) => {
      console.log(`${field}: ${error}`);
    });
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages: ImageFile[] = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: (acceptedFiles) => {
      const newImages: ImageFile[] = acceptedFiles.map(file => ({
        url: URL.createObjectURL(file),
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  });

  // Form değişikliklerini yönet
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Tur tipi değiştiğinde konaklama tipini sıfırla
    if (name === 'tourType' && value === 'Günübirlik Tur') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        accommodationType: '', 
        nights: '', 
        duration: '1'
      }));
    } else {
      setFormData(prev => {
        let updated = { ...prev, [name]: value };
        
        // Eğer gün sayısı değiştiyse ve başlangıç tarihi doluysa tüm tur tarihlerini güncelle
        if (name === 'duration' && prev.startDate) {
          const duration = parseInt(value);
          if (!isNaN(duration)) {
            updated.tourDates = prev.tourDates.map(date => {
              if (date.startDate) {
                const startDate = new Date(date.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + duration - 1);
                return {
                  ...date,
                  endDate: endDate.toISOString().split('T')[0]
                };
              }
              return date;
            });
      }
    }

    // Gece sayısı değiştiğinde gün sayısını güncelle
    if (name === 'nights') {
      const nights = parseInt(value);
      if (!isNaN(nights)) {
            const days = nights + 1;
            updated = {
              ...updated,
          duration: days.toString()
            };
            
            // Eğer başlangıç tarihleri varsa, tüm tur tarihlerinin bitiş tarihlerini güncelle
            if (updated.tourDates.some(date => date.startDate)) {
              updated.tourDates = updated.tourDates.map(date => {
                if (date.startDate) {
                  const startDate = new Date(date.startDate);
        const endDate = new Date(startDate);
                  endDate.setDate(startDate.getDate() + days - 1);
                  return {
                    ...date,
          endDate: endDate.toISOString().split('T')[0]
                  };
                }
                return date;
              });
            }
          }
        }

        return updated;
      });
    }

    // Hata varsa temizle
    if (errors[name as keyof TourFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // DatePicker için özel handler
  const handleDateFieldChange = (name: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => {
      let updated = { ...prev, [name]: value };
      
      // Eğer başlangıç tarihi değiştiyse ve gün sayısı doluysa tüm tur tarihlerinin bitiş tarihlerini güncelle
      if (name === 'startDate' && prev.duration) {
        const duration = parseInt(prev.duration);
        if (!isNaN(duration) && value) {
          const startDate = new Date(value);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + duration - 1);
          updated.endDate = endDate.toISOString().split('T')[0];
          
          // Tüm tur tarihlerini güncelle
          updated.tourDates = prev.tourDates.map(date => ({
            ...date,
            startDate: value,
            endDate: endDate.toISOString().split('T')[0]
          }));
        }
      }
      
      return updated;
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Sayısal değerleri yönet
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setFormData(prev => ({ ...prev, [name]: numberValue }));
      if (errors[name as keyof TourFormData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // Dahil olanları yönet
  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  // Hariç olanları yönet
  const handleAddExclude = () => {
    if (newExclude.trim()) {
      setFormData(prev => ({
        ...prev,
        excludes: [...prev.excludes, newExclude.trim()]
      }));
      setNewExclude('');
    }
  };

  const handleRemoveExclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }));
  };

  // Program (itinerary) yönetimi
  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleAddItineraryDay = () => {
    if (formData.itinerary.length >= parseInt(formData.duration)) {
      alert('Maksimum gün sayısına ulaştınız!');
      return;
    }

    const dayIndex = formData.itinerary.length;
    const tourDate = formData.tourDates[0]; // İlk tur tarihini baz alıyoruz
    let dayDate = '';
    
    if (tourDate && tourDate.startDate) {
      const date = new Date(tourDate.startDate);
      date.setDate(date.getDate() + dayIndex);
      dayDate = date.toLocaleDateString('tr-TR', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { 
        title: `${dayIndex + 1}. Gün - ${dayDate}`, 
        description: '' 
      }]
    }));
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  // Resim ekleme - gerçek uygulamada resim yükleme API'si kullanılır
  const handleImageUpload = (files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Yeni tur tarihi ekleme
  const handleAddTourDate = () => {
    const newTourDate: TourDate = {
      startDate: '',
      endDate: '',
      price: formData.price || '0',
      availableSeats: formData.maxParticipants.toString() || '0',
      soldSeats: 0,
      waitingList: 0,
      discount: 0,
      minParticipants: formData.maxParticipants.toString() || '',
      maxParticipants: formData.maxParticipants.toString() || '',
      earlyBirdDiscount: 0,
      lastMinuteDiscount: 0,
      earlyBirdDeadline: '',
      lastMinuteStart: '',
      notes: '',
      status: 'ACTIVE',
      ageRanges: []
    };
    
    setFormData(prev => ({
      ...prev,
      tourDates: [...prev.tourDates, newTourDate]
    }));
  };

  // Tur tarihi silme
  const handleRemoveTourDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tourDates: prev.tourDates.filter((_, i) => i !== index)
    }));
  };

  // Tur tarihi güncelleme
  const handleTourDateChange = (index: number, field: keyof TourDate, value: string) => {
    setFormData(prev => {
      const newTourDates = [...prev.tourDates];
      
      // Başlangıç tarihi değiştiğinde
      if (field === 'startDate') {
        const startDate = new Date(value);
        const duration = parseInt(prev.duration);
        if (!isNaN(duration) && value) {
        const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + duration - 1);
        newTourDates[index] = {
          ...newTourDates[index],
          startDate: value,
          endDate: endDate.toISOString().split('T')[0]
        };
          return { ...prev, tourDates: newTourDates };
        }
      }
      
        newTourDates[index] = {
          ...newTourDates[index],
          [field]: value
        };
      return { ...prev, tourDates: newTourDates };
    });
  };

  // Form doğrulama
  const validateBasicForm = (): boolean => {
    const newErrors: Partial<Record<keyof TourFormData, string>> = {};
    
    // Temel validasyonlar
    if (!formData.title?.trim()) newErrors.title = 'Tur adı gerekli';
    if (!formData.description?.trim()) newErrors.description = 'Açıklama gerekli';
    if (!formData.price?.trim()) newErrors.price = 'Fiyat gerekli';
    if (!formData.departureCity?.trim()) newErrors.departureCity = 'Kalkış şehri gerekli';
    if (!formData.duration?.trim()) newErrors.duration = 'Süre gerekli';
    if (!formData.maxParticipants) newErrors.maxParticipants = 'Maksimum katılımcı sayısı gerekli';
    if (!formData.transportation?.trim()) newErrors.transportation = 'Ulaşım tipi gerekli';
    if (!formData.tourType?.trim()) newErrors.tourType = 'Tur tipi gerekli';
    if (formData.images.length === 0) newErrors.images = 'En az bir resim gerekli';
    
    // Konaklama tipi kontrolü (günübirlik tur değilse)
    if (formData.tourType !== 'Günübirlik Tur' && !formData.accommodationType?.trim()) {
      newErrors.accommodationType = 'Konaklama tipi gerekli';
    }

    setErrors(newErrors);
    logValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDetailsForm = (): boolean => {
    const newErrors: Partial<Record<keyof TourFormData, string>> = {};
    
    // Tur tarihleri kontrolü
    if (formData.tourDates.length === 0) {
      newErrors.tourDates = 'En az bir tur tarihi eklemelisiniz';
    } else {
      formData.tourDates.forEach((date, index) => {
        if (!date.startDate) {
          newErrors.tourDates = `${index + 1}. tur için başlangıç tarihi gerekli`;
          return;
        }
        if (!date.endDate) {
          newErrors.tourDates = `${index + 1}. tur için bitiş tarihi gerekli`;
          return;
        }
        if (!date.price || parseFloat(date.price) <= 0) {
          newErrors.tourDates = `${index + 1}. tur için geçerli bir fiyat girilmeli`;
          return;
        }
        if (!date.availableSeats || parseInt(date.availableSeats) <= 0) {
          newErrors.tourDates = `${index + 1}. tur için geçerli bir kontenjan girilmeli`;
          return;
        }

        // Diğer kontroller...
      });
    }

    // Yolcu alma noktaları kontrolü
    if (formData.pickupPoints.length === 0) {
      newErrors.pickupPoints = 'En az bir yolcu alma noktası eklemelisiniz';
    } else {
      formData.pickupPoints.forEach((point, index) => {
        if (!point.city?.trim()) {
          newErrors.pickupPoints = `${index + 1}. noktada şehir bilgisi gerekli`;
          return;
        }
        if (!point.location?.trim()) {
          newErrors.pickupPoints = `${index + 1}. noktada konum bilgisi gerekli`;
          return;
        }
        if (!point.time?.trim()) {
          newErrors.pickupPoints = `${index + 1}. noktada saat bilgisi gerekli`;
          return;
        }
      });
    }
    
    setErrors(newErrors);
    logValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    return step === 'basic' ? validateBasicForm() : validateDetailsForm();
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        console.log('Form gönderimi başlıyor...');

        const formDataToSubmit = {
          title: formData.title,
          description: formData.description,
        duration: parseInt(formData.duration),
          nights: parseInt(formData.nights || '0'),
          price: parseFloat(formData.price),
          maxParticipants: parseInt(formData.maxParticipants.toString()),
          currentParticipants: parseInt(formData.currentParticipants.toString()),
          images: formData.images.map(img => img.url),
          includes: formData.includes,
          excludes: formData.excludes,
          features: formData.features,
          itinerary: formData.itinerary,
          featured: false,
          tourOperatorId: partnerId,
          departureCity: formData.departureCity,
          transportation: formData.transportation,
          period: formData.period,
          tourType: formData.tourType,
          accommodationType: formData.accommodationType,
          difficultyLevel: formData.difficultyLevel,
          ageRestriction: formData.ageRestriction ? parseInt(formData.ageRestriction.toString()) : null,
          languages: formData.languages,
          tags: formData.tags,
          data: {
            meetingPoint: formData.meetingPoint,
            meetingTime: formData.meetingTime,
            features: formData.features,
            nights: formData.nights
          },
          destinations: formData.destinations,
        tourDates: formData.tourDates.map(date => ({
            startDate: date.startDate ? new Date(date.startDate).toISOString() : null,
            endDate: date.endDate ? new Date(date.endDate).toISOString() : null,
            price: parseFloat(date.price),
            availableSeats: parseInt(date.availableSeats),
            soldSeats: parseInt(date.soldSeats.toString()),
            waitingList: parseInt(date.waitingList.toString()),
            discount: parseFloat(date.discount.toString()),
            minParticipants: date.minParticipants ? parseInt(date.minParticipants) : null,
            maxParticipants: date.maxParticipants ? parseInt(date.maxParticipants) : null,
            earlyBirdDiscount: parseFloat(date.earlyBirdDiscount.toString()),
            lastMinuteDiscount: parseFloat(date.lastMinuteDiscount.toString()),
            earlyBirdDeadline: date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline).toISOString() : null,
            lastMinuteStart: date.lastMinuteStart ? new Date(date.lastMinuteStart).toISOString() : null,
            notes: date.notes || '',
            status: date.status || 'ACTIVE'
          })),
          pickupPoints: formData.pickupPoints.map((point, index) => ({
            city: point.city,
            location: point.location,
            time: point.time,
            description: point.description || '',
            order: index,
            isActive: true
          })),
          availableDates: formData.tourDates.map(d => new Date(d.startDate))
        };

        console.log('Gönderilecek veriler:', formDataToSubmit);

        const response = await fetch('/api/tours', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSubmit),
          credentials: 'include'
        });

        const responseData = await response.json();
        console.log('API Yanıtı:', responseData);

        if (!response.ok) {
          throw new Error(responseData?.error ?? responseData?.message ?? 'Sunucudan bilinmeyen bir hata döndü');
        }

        if (!responseData.id) {
          throw new Error('Tur ID bulunamadı');
        }

        // Başarılı yanıt
        console.log('Form başarıyla gönderildi. Tur ID:', responseData.id);
        window.location.href = `/partner-dashboard/tours/${responseData.id}`;

      } catch (error) {
        console.error('Form gönderimi hatası:', error);
        const errorMessage = error instanceof Error ? error.message : 'Tur oluşturulurken bir hata oluştu. Lütfen tüm alanları kontrol edip tekrar deneyiniz.';
        setSubmitError(errorMessage);
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Form validasyonu başarısız');
      setSubmitError('Lütfen form alanlarını kontrol ediniz.');
    }
  };

  // Yeni özellik ekleme
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Yolcu alma noktalarını yönet
  const handlePickupPointsChange = (points: PickupPoint[]) => {
    setFormData(prev => ({
      ...prev,
      pickupPoints: points
    }));
  };

  // Destinasyonları yönet
  const handleDestinationsChange = (index: number, field: keyof Destination, value: string) => {
    setFormData(prev => {
      const newDestinations = [...prev.destinations];
      newDestinations[index] = { ...newDestinations[index], [field]: value };
      return { ...prev, destinations: newDestinations };
    });
  };

  // Bugünün tarihini YYYY-MM-DD formatında al
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const handleAddAgeRange = (tourDateIndex: number) => {
    const newFormData = { ...formData };
    if (!newFormData.tourDates[tourDateIndex].ageRanges) {
      newFormData.tourDates[tourDateIndex].ageRanges = [];
    }
    
    // Mevcut yaş aralıklarını sırala
    const sortedRanges = [...newFormData.tourDates[tourDateIndex].ageRanges].sort((a, b) => a.minAge - b.minAge);
    
    // Son yaş aralığının bitiş yaşının bir fazlasını başlangıç yaşı olarak al
    const lastRange = sortedRanges[sortedRanges.length - 1];
    const startAge = lastRange ? (lastRange.maxAge ? lastRange.maxAge + 1 : lastRange.minAge + 1) : 0;
    
    newFormData.tourDates[tourDateIndex].ageRanges.push({
      minAge: startAge,
      maxAge: null,
      pricingType: 'percentage',
      value: 0
    });
    
    setFormData(newFormData);
  };

  const validateAgeRanges = (tourDateIndex: number) => {
    const ranges = formData.tourDates[tourDateIndex].ageRanges;
    const sortedRanges = [...ranges].sort((a, b) => a.minAge - b.minAge);
    
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentRange = sortedRanges[i];
      const nextRange = sortedRanges[i + 1];
      
      // Eğer mevcut aralığın bitişi, sonraki aralığın başlangıcından büyükse çakışma var
      if (currentRange.maxAge && currentRange.maxAge >= nextRange.minAge) {
        return false;
      }
    }
    
    return true;
  };

  const handleAgeRangeChange = (
    tourDateIndex: number,
    ageRangeIndex: number,
    field: keyof AgeRange,
    value: string | number | null
  ) => {
    const newFormData = { ...formData };
    const ageRange = newFormData.tourDates[tourDateIndex].ageRanges[ageRangeIndex];
    
    if (field === 'minAge' || field === 'maxAge') {
      const newValue = value === null ? null : Number(value);
      
      if (field === 'minAge') {
        if (newValue === null) {
          alert('Başlangıç yaşı boş bırakılamaz.');
          return;
        }
        ageRange.minAge = newValue;
      } else if (field === 'maxAge') {
        ageRange.maxAge = newValue;
      }
    } else if (field === 'value') {
      ageRange[field] = Number(value);
    } else if (field === 'pricingType') {
      ageRange[field] = value as 'free' | 'half' | 'percentage' | 'fixed';
    }
    
    setFormData(newFormData);
  };

  const handleRemoveAgeRange = (tourDateIndex: number, ageRangeIndex: number) => {
    const newFormData = { ...formData };
    newFormData.tourDates[tourDateIndex].ageRanges.splice(ageRangeIndex, 1);
    setFormData(newFormData);
  };

  return (
    <div className="space-y-8">
      {/* Hata Mesajları */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata! </strong>
          <span className="block sm:inline">{submitError}</span>
          {Object.entries(errors).length > 0 && (
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Temel Bilgiler */}
        {step === 'basic' && (
          <div className="space-y-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Temel Bilgiler</h2>
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900">
              Tur Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              placeholder="Muhteşem Kapadokya Turu"
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              placeholder="Turunuzu detaylı bir şekilde açıklayın..."
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-900">
                Fiyat (₺) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">₺</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} pl-8 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                  placeholder="1500"
                  min="0"
                />
              </div>
              {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="discount" className="mb-2 block text-sm font-medium text-gray-900">
                İndirim Oranı (%)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500">%</span>
                </div>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount || ''}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 pr-8 pl-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="departureCity" className="mb-2 block text-sm font-medium text-gray-900">
                Kalkış Şehri <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="departureCity"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.departureCity ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="İstanbul"
              />
              {errors.departureCity && <p className="mt-2 text-sm text-red-600">{errors.departureCity}</p>}
            </div>

            <div>
              <label htmlFor="region" className="mb-2 block text-sm font-medium text-gray-900">
                Bölge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.region ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="Marmara"
              />
              {errors.region && <p className="mt-2 text-sm text-red-600">{errors.region}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nights" className="mb-2 block text-sm font-medium text-gray-900">
                Gece Sayısı <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="nights"
                name="nights"
                value={formData.nights || ''}
                onChange={handleChange}
                disabled={formData.tourType === 'Günübirlik Tur'}
                className={`block w-full rounded-lg border ${errors.nights ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${formData.tourType === 'Günübirlik Tur' ? 'bg-gray-100' : ''}`}
                placeholder="3"
                min="0"
              />
              {errors.nights && <p className="mt-2 text-sm text-red-600">{errors.nights}</p>}
            </div>

            <div>
              <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-900">
                Gün Sayısı <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                disabled={true}
                className={`block w-full rounded-lg border ${errors.duration ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-gray-100`}
                placeholder="4"
                min="1"
              />
              {errors.duration && <p className="mt-2 text-sm text-red-600">{errors.duration}</p>}
            </div>
            </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="maxParticipants" className="mb-2 block text-sm font-medium text-gray-900">
                Maksimum Katılımcı <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants || ''}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.maxParticipants ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="20"
                min="1"
              />
              {errors.maxParticipants && <p className="mt-2 text-sm text-red-600">{errors.maxParticipants}</p>}
          </div>

            <div>
              <label htmlFor="currentParticipants" className="mb-2 block text-sm font-medium text-gray-900">
                Mevcut Katılımcı
              </label>
              <input
                type="number"
                id="currentParticipants"
                name="currentParticipants"
                value={formData.currentParticipants || ''}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-gray-900">
                Başlangıç Tarihi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  label=""
                  value={formData.startDate}
                  onChange={(val) => handleDateFieldChange('startDate', val)}
                  placeholder="gg.aa.yyyy"
                  minDate={todayStr}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-full p-1 border border-gray-200">
                </div>
              </div>
              {errors.startDate && <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="mb-2 block text-sm font-medium text-gray-900">
                Bitiş Tarihi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  label=""
                  value={formData.endDate}
                  onChange={() => {}}
                  placeholder="gg.aa.yyyy"
                  minDate={formData.startDate || todayStr}
                  disabled={true}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-full p-1 border border-gray-200"></div>
              </div>
              {errors.endDate && <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="transportation" className="mb-2 block text-sm font-medium text-gray-900">
                Ulaşım Tipi <span className="text-red-500">*</span>
              </label>
              <select
                id="transportation"
                name="transportation"
                value={formData.transportation}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.transportation ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              >
                <option value="">Seçiniz</option>
                <option value="Otobüs">Otobüs</option>
                <option value="Uçak">Uçak</option>
                <option value="Tren">Tren</option>
                <option value="Minibüs">Minibüs</option>
                <option value="Özel Araç">Özel Araç</option>
              </select>
              {errors.transportation && <p className="mt-2 text-sm text-red-600">{errors.transportation}</p>}
            </div>

            <div>
              <label htmlFor="tourType" className="mb-2 block text-sm font-medium text-gray-900">
                Tur Tipi <span className="text-red-500">*</span>
              </label>
              <select
                id="tourType"
                name="tourType"
                value={formData.tourType}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.tourType ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              >
                <option value="">Seçiniz</option>
                <option value="Kültür Turu">Kültür Turu</option>
                <option value="Doğa Turu">Doğa Turu</option>
                <option value="Balayı Turu">Balayı Turu</option>
                <option value="Yemek Turu">Yemek Turu</option>
                <option value="Macera Turu">Macera Turu</option>
                <option value="Günübirlik Tur">Günübirlik Tur</option>
              </select>
              {errors.tourType && <p className="mt-2 text-sm text-red-600">{errors.tourType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="accommodationType" className="mb-2 block text-sm font-medium text-gray-900">
                  Konaklama Tipi {formData.tourType !== 'Günübirlik Tur' && <span className="text-red-500">*</span>}
                </label>
                <select
                  id="accommodationType"
                  name="accommodationType"
                  value={formData.accommodationType}
                  onChange={handleChange}
                  disabled={formData.tourType === 'Günübirlik Tur'}
                  className={`block w-full rounded-lg border ${errors.accommodationType ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 ${formData.tourType === 'Günübirlik Tur' ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Seçiniz</option>
                  <option value="Otel">Otel</option>
                  <option value="Pansiyon">Pansiyon</option>
                  <option value="Apart">Apart</option>
                  <option value="Butik Otel">Butik Otel</option>
                  <option value="Kamp">Kamp</option>
                </select>
                {errors.accommodationType && <p className="mt-2 text-sm text-red-600">{errors.accommodationType}</p>}
              </div>
              <div>
                <label htmlFor="accommodationName" className="mb-2 block text-sm font-medium text-gray-900">
                  Konaklama: {formData.accommodationType || ''}
                </label>
                <input
                  type="text"
                  id="accommodationName"
                  name="accommodationName"
                  value={formData.accommodationName || ''}
                  onChange={e => setFormData(prev => ({ ...prev, accommodationName: e.target.value }))}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder={`Konaklama adı örn. A Oteli`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="difficultyLevel" className="mb-2 block text-sm font-medium text-gray-900">
                  Zorluk Seviyesi
                </label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Seçiniz</option>
                  <option value="Kolay">Kolay</option>
                  <option value="Orta">Orta</option>
                  <option value="Zor">Zor</option>
                </select>
              </div>
              <div>
                <label htmlFor="ageRestriction" className="mb-2 block text-sm font-medium text-gray-900">
                  Yaş Sınırı
                </label>
                <input
                  type="number"
                  id="ageRestriction"
                  name="ageRestriction"
                  value={formData.ageRestriction || ''}
                  onChange={handleChange}
                  className="block w-28 rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Tur Resimleri <span className="text-red-500">*</span>
            </label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-gray-300'} px-6 py-8 text-center hover:bg-gray-50`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <PhotoIcon className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">Resim yüklemek için tıklayın veya sürükleyin</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF dosyaları, 10MB'a kadar</p>
              </div>
            </div>
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
            
            {formData.images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 relative">
                      <Image
                        src={image.preview || image.url || '/images/placeholder.jpg'}
                        alt={`Tour image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Buluşma Noktası ve Saati */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="meetingPoint" className="mb-2 block text-sm font-medium text-gray-900">
                  Buluşma Noktası
                </label>
                <input
                  type="text"
                  id="meetingPoint"
                  name="meetingPoint"
                  value={formData.meetingPoint || ''}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder="Örn: Havalimanı Dış Hatlar Terminali"
                />
              </div>
              <div>
                <label htmlFor="meetingTime" className="mb-2 block text-sm font-medium text-gray-900">
                  Buluşma Saati
                </label>
                <input
                  type="time"
                  id="meetingTime"
                  name="meetingTime"
                  value={formData.meetingTime || ''}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            {/* Yolcu Alma Noktaları */}
            <div className="space-y-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">Yolcu Alma Noktaları</h2>
              <PickupPointForm
                pickupPoints={formData.pickupPoints}
                onChange={handlePickupPointsChange}
              />
          </div>
        </div>
      )}

        {/* Detaylar */}
        {step === 'details' && (
          <div className="space-y-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Detaylar</h2>
            
              {/* Dahil Olanlar */}
              <div>
              <label className="block text-sm font-medium text-gray-900">Dahil Olanlar</label>
              <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={newInclude}
                      onChange={(e) => setNewInclude(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  placeholder="Örn: Kahvaltı"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclude}
                  className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Ekle
                    </button>
                  </div>
              <div className="mt-2 flex flex-wrap gap-2">
                    {formData.includes.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveInclude(index)}
                      className="text-gray-500 hover:text-red-500"
                        >
                      <XMarkIcon className="h-4 w-4" />
                        </button>
                  </span>
                    ))}
                </div>
              </div>

              {/* Dahil Olmayanlar */}
              <div>
              <label className="block text-sm font-medium text-gray-900">Dahil Olmayanlar</label>
              <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  placeholder="Örn: Akşam yemeği"
                    />
                    <button
                      type="button"
                      onClick={handleAddExclude}
                  className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Ekle
                    </button>
                  </div>
              <div className="mt-2 flex flex-wrap gap-2">
                    {formData.excludes.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveExclude(index)}
                      className="text-gray-500 hover:text-red-500"
                        >
                      <XMarkIcon className="h-4 w-4" />
                        </button>
                  </span>
                    ))}
            </div>
          </div>

            {/* Program */}
            <div>
              <label className="block text-sm font-medium text-gray-900">Program</label>
              <div className="mt-4 space-y-4">
              {formData.itinerary.map((day, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        placeholder="Gün başlığı"
                      />
                      <textarea
                        value={day.description}
                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        rows={3}
                        placeholder="Gün detayları"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryDay(index)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
              ))}
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Gün Ekle
                </button>
            </div>
          </div>

            {/* Özellikler */}
          <div>
              <label className="block text-sm font-medium text-gray-900">Özellikler</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  placeholder="Örn: Wi-Fi"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Ekle
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
      )}

      {/* Tur Tarihleri */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Tur Tarihleri</h2>
          <button
            type="button"
            onClick={handleAddTourDate}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              <PlusIcon className="w-5 h-5 mr-2" />
              Yeni Tarih Ekle
          </button>
        </div>

          <div className="space-y-6">
          {formData.tourDates.map((date, dateIndex) => (
              <div key={dateIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium text-gray-900">
                    Tur Tarihi #{dateIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveTourDate(dateIndex)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Temel Bilgiler */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Başlangıç Tarihi</label>
                      <input
                        type="date"
                    value={date.startDate}
                        onChange={(e) => handleTourDateChange(dateIndex, 'startDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Bitiş Tarihi</label>
                      <input
                        type="date"
                    value={date.endDate}
                        onChange={(e) => handleTourDateChange(dateIndex, 'endDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Fiyat</label>
                <input
                  type="number"
                  value={date.price}
                  onChange={(e) => handleTourDateChange(dateIndex, 'price', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                  min="0"
                />
              </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Kontenjan</label>
                <input
                  type="number"
                  value={date.availableSeats}
                  onChange={(e) => handleTourDateChange(dateIndex, 'availableSeats', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                  min="0"
                />
              </div>
                  </div>

                  {/* Katılımcı Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Satılan Koltuk</label>
                      <input
                        type="number"
                        value={date.soldSeats}
                        onChange={(e) => handleTourDateChange(dateIndex, 'soldSeats', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Bekleme Listesi</label>
                      <input
                        type="number"
                        value={date.waitingList}
                        onChange={(e) => handleTourDateChange(dateIndex, 'waitingList', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Min. Katılımcı</label>
                      <input
                        type="number"
                        value={date.minParticipants}
                        onChange={(e) => handleTourDateChange(dateIndex, 'minParticipants', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Max. Katılımcı</label>
                      <input
                        type="number"
                        value={date.maxParticipants}
                        onChange={(e) => handleTourDateChange(dateIndex, 'maxParticipants', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* İndirim Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Erken Rezervasyon İndirimi (%)</label>
                      <input
                        type="number"
                        value={date.earlyBirdDiscount}
                        onChange={(e) => handleTourDateChange(dateIndex, 'earlyBirdDiscount', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Son Dakika İndirimi (%)</label>
                      <input
                        type="number"
                        value={date.lastMinuteDiscount}
                        onChange={(e) => handleTourDateChange(dateIndex, 'lastMinuteDiscount', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Erken Rez. Son Tarih</label>
                      <input
                        type="date"
                        value={date.earlyBirdDeadline}
                        onChange={(e) => handleTourDateChange(dateIndex, 'earlyBirdDeadline', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Son Dakika Başlangıç</label>
                      <input
                        type="date"
                        value={date.lastMinuteStart}
                        onChange={(e) => handleTourDateChange(dateIndex, 'lastMinuteStart', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Durum ve Notlar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Durum</label>
                      <select
                        value={date.status}
                        onChange={(e) => handleTourDateChange(dateIndex, 'status', e.target.value as TourDate['status'])}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      >
                        <option value="ACTIVE">Aktif</option>
                        <option value="FULL">Dolu</option>
                        <option value="CANCELLED">İptal</option>
                        <option value="COMPLETED">Tamamlandı</option>
                        <option value="WAITING_LIST">Bekleme Listesi</option>
                        <option value="NOT_ENOUGH_PARTICIPANTS">Yetersiz Katılımcı</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Notlar</label>
                      <textarea
                        value={date.notes}
                        onChange={(e) => handleTourDateChange(dateIndex, 'notes', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Yaş Aralıkları</h4>
                    {date.ageRanges?.map((ageRange, ageIndex) => (
                      <div key={ageIndex} className="flex gap-3 items-start mb-3 bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Başlangıç Yaşı
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={ageRange.minAge || ''}
                            disabled={ageIndex > 0}
                            className={`w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-800 placeholder-neutral-400 ${
                              ageIndex > 0 
                                ? 'bg-neutral-100 cursor-not-allowed' 
                                : 'focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                            }`}
                            placeholder={ageIndex === 0 ? "Örn: 3" : ""}
                            onChange={(e) => {
                              if (ageIndex === 0) {
                                const value = e.target.value.replace(/^0+/, '');
                                if (value === '' || /^\d+$/.test(value)) {
                                  handleAgeRangeChange(dateIndex, ageIndex, 'minAge', value ? Number(value) : 0);
                                }
                              }
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Bitiş Yaşı
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            value={ageRange.maxAge ?? ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/^0+/, '');
                              if (value === '' || /^\d+$/.test(value)) {
                                handleAgeRangeChange(dateIndex, ageIndex, 'maxAge', value ? Number(value) : null);
                              }
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-800 placeholder-neutral-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            placeholder="Örn: 6"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            Fiyatlandırma Tipi
                          </label>
                          <select
                            value={ageRange.pricingType}
                            onChange={(e) => handleAgeRangeChange(dateIndex, ageIndex, 'pricingType', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-800 bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="free">Ücretsiz</option>
                            <option value="half">Yarı Fiyat</option>
                            <option value="percentage">Yüzde İndirim</option>
                            <option value="fixed">Sabit Fiyat</option>
                          </select>
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-neutral-600 mb-1">
                            {ageRange.pricingType === 'percentage' ? 'İndirim Oranı (%)' :
                             ageRange.pricingType === 'fixed' ? 'Sabit Fiyat (₺)' :
                             'Değer'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={ageRange.pricingType === 'percentage' ? 100 : undefined}
                            value={ageRange.value}
                            onChange={(e) => handleAgeRangeChange(dateIndex, ageIndex, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-800 placeholder-neutral-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            placeholder={ageRange.pricingType === 'percentage' ? 'Örn: 50' : 'Örn: 1000'}
                            disabled={ageRange.pricingType === 'free' || ageRange.pricingType === 'half'}
                          />
                        </div>

                        <div className="flex flex-col items-center justify-center mt-6">
                          <span className="text-sm font-medium text-neutral-700 mb-1">
                            {ageRange.maxAge ? `${ageRange.minAge}-${ageRange.maxAge} Yaş` : `${ageRange.minAge}+ Yaş`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAgeRange(dateIndex, ageIndex)}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Yaş aralığını sil"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (!validateAgeRanges(dateIndex)) {
                          alert('Yaş aralıkları arasında çakışma var. Lütfen önce mevcut aralıkları düzenleyin.');
                          return;
                        }
                        handleAddAgeRange(dateIndex);
                      }}
                      className="mt-2 inline-flex items-center text-sm text-sky-600 hover:text-sky-800 font-medium bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-md transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-1.5" />
                      Yaş Aralığı Ekle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Form Gönderme */}
        <div className="flex justify-between pt-4">
        <button
          type="button"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          İptal
          </button>
          
          <div className="flex gap-4">
            {step === 'basic' ? (
              <button
                type="button"
                onClick={() => {
                  if (validateForm()) {
                    window.scrollTo(0, 0);
                    setStep('details');
                  }
                }}
                disabled={isSubmitting}
                className="px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Devam Et
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setStep('basic');
                  }}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Geri Dön
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Kaydet'
                  )}
        </button>
              </>
            )}
          </div>
      </div>
    </form>
    </div>
  );
} 