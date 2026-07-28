'use client';

import React, { useState, useEffect } from 'react';
import { ImageIcon, X, Plus, ChevronDown, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { DatePicker } from '@/components/booking/date-picker';
import { PickupPointForm } from '@/components/features/partner-dashboard/pickup-point-form';
import dynamic from 'next/dynamic';
import { normalizeError, IMAGE_PLACEHOLDER } from '@/lib/partner-tour-helpers';
import { HEALTH_PRIVILEGE_OPTIONS } from '@/lib/constants/health-privileges';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// Önceden tanımlanmış seçenekler
const TOUR_OPTIONS = {
  includes: [
    'Konaklama',
    'Kahvaltı',
    'Öğle Yemeği',
    'Akşam Yemeği',
    'Rehberlik Hizmeti',
    'Ulaşım',
    'Müze Giriş Ücretleri',
    'Seyahat Sigortası',
    'Transfer Hizmeti',
    'Wifi',
    'Ara Öğün İkramları',
    'Fotoğraf Çekimi',
  ],
  excludes: [
    'Alkollü İçecekler',
    'Ekstra Aktiviteler',
    'Kişisel Harcamalar',
    'Öğle Yemeği',
    'Akşam Yemeği',
    'Müze Giriş Ücretleri',
    'Bahşişler',
    'Vize Ücreti',
    'Yurtdışı Çıkış Harcı',
  ],
  healthPrivileges: HEALTH_PRIVILEGE_OPTIONS,
  features: [
    'Ücretsiz İptal',
    'Hemen Onay',
    'Çocuk İndirimi',
    'Erken Rezervasyon İndirimi',
    'Tam Pansiyon',
    'Yarım Pansiyon',
    'Her Şey Dahil',
    'Rehberli Tur',
    'Özel Araç',
    'Lüks Konaklama',
    'Aile Dostu',
    'Engelli Dostu',
    'Evcil Hayvan Dostu',
    'Fotoğraf Turu',
    'Doğa Yürüyüşü',
    'Deniz Aktiviteleri',
    'Kültür Turu',
    'Macera Aktiviteleri',
  ],
} as const;

interface ImageFile {
  url: string;
  file: File | null;
  preview?: string;
}

interface AgeRange {
  minAge: number;
  maxAge: number | null;
  pricingType: 'free' | 'half' | 'percentage' | 'fixed';
  value?: string;
}

interface TourDate {
  startDate: string;
  endDate: string;
  price: string;
  availableSeats: string;
  soldSeats: string;
  minParticipants: string;
  maxParticipants: string;
  earlyBirdDiscount: string;
  lastMinuteDiscount: string;
  earlyBirdDeadline: string;
  lastMinuteStart: string;
  notes: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  ageRanges: AgeRange[];
  earlyBirdDeadlineStart: string;
  earlyBirdDeadlineEnd: string;
  lastMinuteStartStart: string;
  lastMinuteStartEnd: string;
  isExpanded: boolean;
  waitingList?: string; // Eklendi
  discount?: string; // Eklendi
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

// Yeni: Ana görsel ve galeri görselleri için ayrı state
interface GalleryImageFile extends ImageFile {
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
  /** Health conditions this tour can accommodate (operator-selected). */
  healthPrivileges: string[];
  itinerary: {
    title: string;
    description: string;
    images?: { url: string; file: File | null }[];
  }[];
  status: 'active' | 'draft' | 'archived';
  departureCity: string[]; // Tek şehir yerine şehir dizisi
  region: string;
  transportation: string;
  period: string;
  tourType: string;
  accommodationType: string;
  ageRestriction: string;
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
  mainImage: ImageFile | null;
  galleryImages: GalleryImageFile[];
}

interface TourFormProps {
  initialData?: Partial<TourFormData>;
  onSubmit: (
    data: TourFormData | Record<string, unknown>,
  ) => void | Promise<void>;
  onFormDataChange?: (data: TourFormData) => void;
  isSubmitting?: boolean;
  currentStep?: 'basic' | 'details';
  partnerId?: string;
  isUpdateMode?: boolean;
  tourId?: string;
  uploadEntityId?: string;
  uploadImage?: (file: File) => Promise<string>;
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
  healthPrivileges: [],
  itinerary: [],
  status: 'draft',
  departureCity: [''], // Boş bir string ile başlat
  region: '',
  transportation: '',
  period: '',
  tourType: '',
  accommodationType: '',
  ageRestriction: '',
  languages: [],
  tags: [],
  tourDates: [
    {
      startDate: '',
      endDate: '',
      price: '',
      availableSeats: '0',
      soldSeats: '0',
      minParticipants: '',
      maxParticipants: '',
      earlyBirdDiscount: '',
      lastMinuteDiscount: '',
      earlyBirdDeadline: '',
      lastMinuteStart: '',
      notes: '',
      status: 'ACTIVE',
      ageRanges: [],
      earlyBirdDeadlineStart: '',
      earlyBirdDeadlineEnd: '',
      lastMinuteStartStart: '',
      lastMinuteStartEnd: '',
      isExpanded: true,
      waitingList: '0',
      discount: '0',
    },
  ],
  discount: 0,
  destinations: [{ city: '', description: '' }], // En az bir boş destinasyon
  reviews: 0,
  isJointTour: false,
  features: [],
  startDate: '',
  endDate: '',
  accommodationName: '',
  meetingPoint: '',
  meetingTime: '',
  pickupPoints: [],
  mainImage: null,
  galleryImages: [],
};

// Türkiye şehirleri sabitini ekliyorum:
const TURKEY_CITIES = [
  'Adana',
  'Adıyaman',
  'Afyonkarahisar',
  'Ağrı',
  'Amasya',
  'Ankara',
  'Antalya',
  'Artvin',
  'Aydın',
  'Balıkesir',
  'Bilecik',
  'Bingöl',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Çanakkale',
  'Çankırı',
  'Çorum',
  'Denizli',
  'Diyarbakır',
  'Edirne',
  'Elazığ',
  'Erzincan',
  'Erzurum',
  'Eskişehir',
  'Gaziantep',
  'Giresun',
  'Gümüşhane',
  'Hakkari',
  'Hatay',
  'Isparta',
  'Mersin',
  'İstanbul',
  'İzmir',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kırklareli',
  'Kırşehir',
  'Kocaeli',
  'Konya',
  'Kütahya',
  'Malatya',
  'Manisa',
  'Kahramanmaraş',
  'Mardin',
  'Muğla',
  'Muş',
  'Nevşehir',
  'Niğde',
  'Ordu',
  'Rize',
  'Sakarya',
  'Samsun',
  'Siirt',
  'Sinop',
  'Sivas',
  'Tekirdağ',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Şanlıurfa',
  'Uşak',
  'Van',
  'Yozgat',
  'Zonguldak',
  'Aksaray',
  'Bayburt',
  'Karaman',
  'Kırıkkale',
  'Batman',
  'Şırnak',
  'Bartın',
  'Ardahan',
  'Iğdır',
  'Yalova',
  'Karabük',
  'Kilis',
  'Osmaniye',
  'Düzce',
];

// Türkçe karakterler için küçük harfe çeviren fonksiyon
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for city/region search normalization
function turkishToLower(str: string) {
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
}

// Türkiye bölgeleri ve şehirleri
const TURKEY_REGIONS = {
  Marmara: [
    'İstanbul',
    'Bursa',
    'Kocaeli',
    'Sakarya',
    'Tekirdağ',
    'Edirne',
    'Kırklareli',
    'Balıkesir',
    'Çanakkale',
    'Yalova',
    'Bilecik',
  ],
  Ege: [
    'İzmir',
    'Aydın',
    'Muğla',
    'Denizli',
    'Manisa',
    'Afyonkarahisar',
    'Kütahya',
    'Uşak',
  ],
  Akdeniz: [
    'Antalya',
    'Mersin',
    'Adana',
    'Hatay',
    'Osmaniye',
    'Isparta',
    'Burdur',
    'Kahramanmaraş',
  ],
  'İç Anadolu': [
    'Ankara',
    'Konya',
    'Kayseri',
    'Eskişehir',
    'Sivas',
    'Aksaray',
    'Karaman',
    'Kırıkkale',
    'Kırşehir',
    'Nevşehir',
    'Niğde',
    'Yozgat',
  ],
  Karadeniz: [
    'Trabzon',
    'Rize',
    'Artvin',
    'Giresun',
    'Ordu',
    'Samsun',
    'Sinop',
    'Kastamonu',
    'Zonguldak',
    'Bartın',
    'Düzce',
    'Bolu',
    'Amasya',
    'Tokat',
    'Gümüşhane',
    'Bayburt',
  ],
  'Doğu Anadolu': [
    'Erzurum',
    'Erzincan',
    'Kars',
    'Ağrı',
    'Iğdır',
    'Ardahan',
    'Malatya',
    'Elazığ',
    'Bingöl',
    'Tunceli',
    'Van',
    'Bitlis',
    'Muş',
    'Hakkari',
  ],
  'Güneydoğu Anadolu': [
    'Diyarbakır',
    'Şanlıurfa',
    'Mardin',
    'Batman',
    'Siirt',
    'Şırnak',
    'Adıyaman',
    'Gaziantep',
    'Kilis',
  ],
};

// Şehir-bölge eşleştirmesi için yardımcı fonksiyon
const getRegionByCity = (city: string): string => {
  for (const [region, cities] of Object.entries(TURKEY_REGIONS)) {
    if (cities.includes(city)) {
      return region;
    }
  }
  return '';
};

// Önceden tanımlanmış etiketler
const AVAILABLE_TAGS = [
  'Doğa',
  'Tarih',
  'Kültür',
  'Deniz',
  'Dağ',
  'Şehir',
  'Gastronomi',
  'Spor',
  'Macera',
  'Balayı',
  'Aile',
  'Romantik',
  'Ekonomik',
  'Lüks',
  'Balıkçılık',
  'Yürüyüş',
  'Fotoğrafçılık',
  'Yoga',
  'Meditasyon',
  'Festival',
  'Müze',
  'Arkeoloji',
  'Termal',
  'Spa',
  'Golf',
  'Dalış',
  'Rafting',
  'Kayak',
  'Kamp',
  'Tekne',
];

export function TourForm({
  initialData,
  onSubmit,
  onFormDataChange,
  currentStep: initialStep = 'basic',
  partnerId,
  isUpdateMode = false,
  tourId,
  uploadEntityId,
  uploadImage,
}: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>(() => {
    if (initialData) {
      const tourDates = initialData.tourDates?.map(
        (
          date: Partial<TourDate> & {
            price?: string | number;
            availableSeats?: string | number;
            minParticipants?: string | number;
            maxParticipants?: string | number;
          },
        ) => ({
          startDate: date.startDate || '',
          endDate: date.endDate || '',
          price: date.price?.toString() || '0',
          availableSeats: date.availableSeats?.toString() || '0',
          soldSeats: date.soldSeats || '',
          minParticipants: date.minParticipants?.toString() || '',
          maxParticipants: date.maxParticipants?.toString() || '',
          earlyBirdDiscount: date.earlyBirdDiscount || '',
          lastMinuteDiscount: date.lastMinuteDiscount || '',
          earlyBirdDeadline: date.earlyBirdDeadline || '',
          lastMinuteStart: date.lastMinuteStart || '',
          notes: date.notes || '',
          status: date.status || 'ACTIVE',
          ageRanges: date.ageRanges || [],
          earlyBirdDeadlineStart: date.earlyBirdDeadlineStart || '',
          earlyBirdDeadlineEnd: date.earlyBirdDeadlineEnd || '',
          lastMinuteStartStart: date.lastMinuteStartStart || '',
          lastMinuteStartEnd: date.lastMinuteStartEnd || '',
          isExpanded: date.isExpanded || true,
        }),
      ) || [defaultFormData.tourDates[0]];

      return {
        ...defaultFormData,
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        location: initialData.location || '',
        duration: initialData.duration || '',
        maxParticipants: initialData.maxParticipants || 0,
        currentParticipants: initialData.currentParticipants || 0,
        images: initialData.images || [],
        includes: initialData.includes || [],
        excludes: initialData.excludes || [],
        healthPrivileges: initialData.healthPrivileges || [],
        itinerary: initialData.itinerary || [],
        status: initialData.status || 'draft',
        departureCity: Array.isArray(initialData.departureCity)
          ? initialData.departureCity
          : initialData.departureCity
            ? [initialData.departureCity]
            : [''], // Dizi kontrolü
        region: initialData.region || '',
        transportation: initialData.transportation || '',
        period: initialData.period || '',
        tourType: initialData.tourType || '',
        accommodationType: initialData.accommodationType || '',
        ageRestriction: initialData.ageRestriction || '',
        languages: initialData.languages || [],
        tags: initialData.tags || [],
        tourDates,
        discount: initialData.discount || 0,
        destinations:
          initialData.destinations && initialData.destinations.length > 0
            ? initialData.destinations.map((dest) => ({
                city: dest.city ?? '',
                description: dest.description ?? '',
              }))
            : [{ city: '', description: '' }],
        reviews: initialData.reviews || 0,
        isJointTour: initialData.isJointTour || false,
        features: initialData.features || [],
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        accommodationName: initialData.accommodationName || '',
        meetingPoint: initialData.meetingPoint || '',
        meetingTime: initialData.meetingTime || '',
        pickupPoints: initialData.pickupPoints || [],
        nights: initialData.nights || '',
        mainImage: initialData.mainImage || null,
        galleryImages: initialData.galleryImages || [],
      };
    }
    return defaultFormData;
  });
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [newHealthPrivilege, setNewHealthPrivilege] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof TourFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form verileri değiştiğinde callback'i çağır
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);

  // Validasyon hatalarını konsola yazdır
  const logValidationErrors = (
    errors: Partial<Record<keyof TourFormData, string>>,
  ) => {
    console.log('Validasyon Hataları:', errors);
    // Her bir hata için detaylı log
    Object.entries(errors).forEach(([field, error]) => {
      console.log(`${field}: ${error}`);
    });
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    if (uploadImage) {
      return uploadImage(file);
    }
    if (!uploadEntityId) {
      throw new Error('Görsel yüklemek için tur veya partner kimliği gerekli');
    }
    throw new Error('Görsel yükleme yapılandırılmadı');
  };

  const uploadImagesToForm = async (
    files: File[],
    target: 'images' | 'gallery' | 'main' | 'itinerary',
    dayIdx?: number,
  ) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploadError(null);
    setIsUploadingImages(true);
    try {
      const {
        prepareTourImageFile,
        TOUR_COVER_IMAGE_OPTIONS,
        TOUR_GALLERY_IMAGE_OPTIONS,
      } = await import('@/lib/prepare-tour-image');
      const uploadedImages: ImageFile[] = [];
      for (const file of imageFiles) {
        const prepared = await prepareTourImageFile(
          file,
          target === 'main'
            ? TOUR_COVER_IMAGE_OPTIONS
            : TOUR_GALLERY_IMAGE_OPTIONS,
        );
        const url = await uploadImageFile(prepared);
        // Blob preview avoids Next /_next/image → r2.dev TLS 500 while uploading
        uploadedImages.push({
          url,
          file: prepared,
          preview: URL.createObjectURL(prepared),
        });
      }

      setFormData((prev) => {
        if (target === 'images') {
          return { ...prev, images: [...prev.images, ...uploadedImages] };
        }
        if (target === 'gallery') {
          const galleryImages: GalleryImageFile[] = uploadedImages.map(
            (img) => ({
              ...img,
              description: '',
            }),
          );
          return {
            ...prev,
            galleryImages: [...prev.galleryImages, ...galleryImages],
          };
        }
        if (target === 'main' && uploadedImages[0]) {
          return { ...prev, mainImage: uploadedImages[0] };
        }
        if (target === 'itinerary' && dayIdx !== undefined) {
          const newItinerary = [...prev.itinerary];
          const day = { ...newItinerary[dayIdx] };
          const itineraryImages = uploadedImages.map((img) => ({
            url: img.url,
            file: null,
          }));
          day.images = [...(day.images || []), ...itineraryImages];
          newItinerary[dayIdx] = day;
          return { ...prev, itinerary: newItinerary };
        }
        return prev;
      });
    } catch (err) {
      setUploadError(
        normalizeError(err, 'Görsel yüklenirken bir hata oluştu').message,
      );
    } finally {
      setIsUploadingImages(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    disabled: isUploadingImages,
    onDrop: (acceptedFiles) => {
      void uploadImagesToForm(acceptedFiles, 'images');
    },
  });

  // Form değişikliklerini yönet
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    let newValue: string = value;

    if (type === 'number') {
      // Başındaki sıfırları sil
      newValue = value.replace(/^0+/, '');
      // Eğer input tamamen boşsa, boş string olarak bırak
      if (newValue === '') newValue = '';
    }

    if (name === 'nights') {
      // Gece sayısına göre gün sayısını hesapla (gece + 1)
      const days = newValue ? parseInt(newValue) + 1 : '';
      setFormData((prev) => ({
        ...prev,
        nights: newValue,
        duration: days.toString(),
      }));
    } else if (
      name === 'startDate' ||
      name === 'endDate' ||
      name === 'price' ||
      name === 'maxParticipants'
    ) {
      // Ana form alanları değiştiğinde ilk tur tarihini güncelle
      setFormData((prev) => {
        const updatedTourDates = [...prev.tourDates];
        if (updatedTourDates.length > 0) {
          updatedTourDates[0] = {
            ...updatedTourDates[0],
            startDate:
              name === 'startDate' ? value : updatedTourDates[0].startDate,
            endDate: name === 'endDate' ? value : updatedTourDates[0].endDate,
            price: name === 'price' ? value : updatedTourDates[0].price,
            maxParticipants:
              name === 'maxParticipants'
                ? value
                : updatedTourDates[0].maxParticipants,
            minParticipants:
              name === 'maxParticipants'
                ? Math.floor(Number(value) / 2).toString()
                : updatedTourDates[0].minParticipants,
          };
        }
        return {
          ...prev,
          [name]: newValue,
          tourDates: updatedTourDates,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // Tarih değişikliklerini yönet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- legacy handler kept for date field wiring
  const handleDateFieldChange = (
    field: 'startDate' | 'endDate',
    value: string,
  ) => {
    if (field === 'startDate') {
      // Başlangıç tarihi seçildiğinde, gece sayısına göre bitiş tarihini hesapla
      if (value && formData.nights) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(formData.nights));

        setFormData((prev) => ({
          ...prev,
          startDate: value,
          endDate: endDate.toISOString().split('T')[0],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          startDate: value,
        }));
      }
    }
  };

  // Sayısal değerleri yönet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- legacy handler kept for numeric inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setFormData((prev) => ({ ...prev, [name]: numberValue }));
      if (errors[name as keyof TourFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // Dahil olanları yönet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- add flow wired via preset options
  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setFormData((prev) => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()],
      }));
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index),
    }));
  };

  // Hariç olanları yönet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- add flow wired via preset options
  const handleAddExclude = () => {
    if (newExclude.trim()) {
      setFormData((prev) => ({
        ...prev,
        excludes: [...prev.excludes, newExclude.trim()],
      }));
      setNewExclude('');
    }
  };

  const handleRemoveExclude = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveHealthPrivilege = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      healthPrivileges: prev.healthPrivileges.filter((_, i) => i !== index),
    }));
  };

  // Program (itinerary) yönetimi
  const handleItineraryChange = (
    index: number,
    field: 'title' | 'description',
    value: string,
  ) => {
    setFormData((prev) => {
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
        year: 'numeric',
      });
    }

    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          title: `${dayIndex + 1}. Gün - ${dayDate}`,
          description: '',
        },
      ],
    }));
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropzone uses uploadImagesToForm directly
  const handleImageUpload = (files: File[]) => {
    void uploadImagesToForm(files, 'images');
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for tour date end-date calculation
  const calcEndDate = (start: string | Date | null | undefined) => {
    if (!start || !formData.duration) return '';
    const d = new Date(start);
    d.setDate(d.getDate() + Number(formData.duration) - 1);
    return d.toISOString().split('T')[0];
  };

  // Tur adı benzersiz mi kontrolü (placeholder, backend ile entegrasyon gerektirir)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- API uniqueness check stub
  const checkTitleUnique = async (_title: string): Promise<boolean> => {
    // TODO: API ile benzersizlik kontrolü yapılacak
    // Şimdilik true döndür (her zaman benzersiz kabul et)
    return true;
  };

  // Form doğrulama
  const validateBasicForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof TourFormData, string>> = {};

    // Zorunlu alanlar
    if (!formData.title?.trim()) newErrors.title = 'Tur adı gerekli';
    else if (formData.title.length < 5)
      newErrors.title = 'Tur adı en az 5 karakter olmalı';
    else if (formData.title.length > 100)
      newErrors.title = 'Tur adı en fazla 100 karakter olmalı';

    if (!formData.description?.trim())
      newErrors.description = 'Açıklama gerekli';
    else if (formData.description.length < 50)
      newErrors.description = 'Açıklama en az 50 karakter olmalı';

    if (!formData.price?.trim()) newErrors.price = 'Fiyat gerekli';
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = 'Geçerli bir fiyat giriniz';

    // Kalkış şehirleri kontrolü
    if (!formData.departureCity || formData.departureCity.length === 0) {
      newErrors.departureCity = 'En az bir kalkış şehri seçmelisiniz';
    } else {
      const emptyCities = formData.departureCity.filter(
        (city) => !city?.trim(),
      );
      if (emptyCities.length > 0) {
        newErrors.departureCity =
          'Tüm kalkış şehirleri için şehir seçimi yapılmalı';
      }
    }

    if (!formData.nights?.trim()) newErrors.nights = 'Gece sayısı gerekli';
    if (!formData.maxParticipants || formData.maxParticipants <= 0)
      newErrors.maxParticipants = 'Maksimum katılımcı sayısı gerekli';
    if (!formData.transportation?.trim())
      newErrors.transportation = 'Ulaşım tipi gerekli';
    if (!formData.tourType?.trim()) newErrors.tourType = 'Tur tipi gerekli';

    // Destinasyonlar kontrolü
    if (formData.destinations.length === 0) {
      newErrors.destinations = 'En az bir destinasyon eklemelisiniz';
    } else {
      const emptyDestinations = formData.destinations.filter(
        (dest) => !dest.city?.trim(),
      );
      if (emptyDestinations.length > 0) {
        newErrors.destinations =
          'Tüm destinasyonlar için şehir seçimi yapılmalı';
      }
    }

    // Konaklama tipi sadece günübirlik tur değilse zorunlu
    if (
      formData.tourType &&
      formData.tourType !== 'Günübirlik Tur' &&
      !formData.accommodationType?.trim()
    ) {
      newErrors.accommodationType = 'Konaklama tipi gerekli';
    }

    // Opsiyonel alanlar (uyarı ver ama engelleme)
    if (!formData.mainImage) {
      console.warn('Ana görsel yüklenmemiş');
    }
    if (formData.galleryImages.length < 3) {
      console.warn('En az 3 galeri görseli önerilir');
    }
    if (formData.images.length === 0) {
      console.warn('Tur görselleri yüklenmemiş');
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

  const validateForm = async (): Promise<boolean> => {
    try {
      // Eğer basic step'teyse sadece temel bilgileri kontrol et
      if (step === 'basic') {
        const basicValid = await validateBasicForm();
        return basicValid;
      }
      // Eğer details step'teyse hem temel hem detayları kontrol et
      const basicValid = await validateBasicForm();
      const detailsValid = validateDetailsForm();
      return basicValid && detailsValid;
    } catch (error) {
      console.error('Form validation error:', error);
      return false;
    }
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (isUploadingImages) {
      setSubmitError(
        'Görseller yükleniyor. Lütfen yükleme tamamlanana kadar bekleyin.',
      );
      return;
    }

    const hasBlobUrls = formData.images.some((img) =>
      img?.url?.startsWith('blob:'),
    );
    if (hasBlobUrls) {
      setSubmitError(
        'Görseller geçici bağlantı olarak kaydedilmiş. Lütfen görselleri yeniden yükleyin.',
      );
      return;
    }

    if (isUpdateMode && !tourId) {
      setSubmitError(
        'Tur kimliği bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.',
      );
      return;
    }

    if (!isUpdateMode && !partnerId) {
      setSubmitError(
        'Tur operatör bilgisi yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyin.',
      );
      return;
    }

    const isValid = await validateForm();
    if (!isValid) {
      setSubmitError('Lütfen form alanlarını kontrol ediniz.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Form gönderimi başlıyor...');
      console.log('isUpdateMode:', isUpdateMode);

      // Boş şehirli destinasyonları filtrele ve sadece city/description gönder
      const filteredDestinations = formData.destinations
        .filter((dest) => dest.city && dest.city.trim())
        .map((dest) => ({
          city: dest.city,
          description: dest.description || '',
        }));

      // Boş kalkış şehirlerini filtrele
      const filteredDepartureCities = formData.departureCity.filter(
        (city) => city && city.trim(),
      );

      const formDataToSubmit = {
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration, 10) || 0,
        nights: parseInt(formData.nights || '0', 10) || 0,
        price: parseFloat(formData.price) || 0,
        maxParticipants: parseInt(formData.maxParticipants.toString(), 10) || 0,
        currentParticipants:
          parseInt(formData.currentParticipants.toString(), 10) || 0,
        destinations: filteredDestinations,
        departureCity: filteredDepartureCities,
        images: formData.images
          .map((img) => img?.url)
          .filter((url): url is string => Boolean(url)),
        includes: formData.includes,
        excludes: formData.excludes,
        healthPrivileges: formData.healthPrivileges,
        features: formData.features,
        itinerary: formData.itinerary.map((day) => ({
          title: day.title,
          description: day.description,
          images: day.images?.map((image) => image.url).filter(Boolean) ?? [],
        })),
        featured: false,
        tourOperatorId: partnerId,
        region: formData.region,
        transportation: formData.transportation,
        period: formData.period,
        tourType: formData.tourType,
        accommodationType: formData.accommodationType,
        ageRestriction: formData.ageRestriction,
        languages: formData.languages,
        tags: formData.tags,
        accommodationName: formData.accommodationName,
        meetingPoint: formData.meetingPoint,
        meetingTime: formData.meetingTime,
        data: {
          meetingPoint: formData.meetingPoint,
          meetingTime: formData.meetingTime,
          features: formData.features,
          nights: formData.nights,
        },
        tourDates: formData.tourDates.map((date) => ({
          startDate: date.startDate
            ? new Date(date.startDate).toISOString()
            : null,
          endDate: date.endDate ? new Date(date.endDate).toISOString() : null,
          price: parseFloat(date.price || '0'),
          availableSeats: parseInt(date.availableSeats || '0', 10),
          soldSeats: parseInt(date.soldSeats || '0', 10),
          waitingList: parseInt(date.waitingList || '0', 10),
          discount: parseFloat(date.discount || '0'),
          minParticipants:
            date.minParticipants && date.minParticipants.trim()
              ? parseInt(date.minParticipants, 10)
              : null,
          maxParticipants:
            date.maxParticipants && date.maxParticipants.trim()
              ? parseInt(date.maxParticipants, 10)
              : null,
          earlyBirdDiscount:
            date.earlyBirdDiscount && date.earlyBirdDiscount.trim()
              ? parseFloat(date.earlyBirdDiscount)
              : 0,
          lastMinuteDiscount:
            date.lastMinuteDiscount && date.lastMinuteDiscount.trim()
              ? parseFloat(date.lastMinuteDiscount)
              : 0,
          earlyBirdDeadlineStart:
            date.earlyBirdDeadlineStart && date.earlyBirdDeadlineStart.trim()
              ? new Date(date.earlyBirdDeadlineStart).toISOString()
              : null,
          earlyBirdDeadline:
            date.earlyBirdDeadlineEnd && date.earlyBirdDeadlineEnd.trim()
              ? new Date(date.earlyBirdDeadlineEnd).toISOString()
              : null,
          lastMinuteStart:
            date.lastMinuteStartStart && date.lastMinuteStartStart.trim()
              ? new Date(date.lastMinuteStartStart).toISOString()
              : null,
          lastMinuteStartEnd:
            date.lastMinuteStartEnd && date.lastMinuteStartEnd.trim()
              ? new Date(date.lastMinuteStartEnd).toISOString()
              : null,
          notes: date.notes || '',
          status: date.status || 'ACTIVE',
          ageRanges: date.ageRanges
            ? date.ageRanges
                .filter(
                  (range) =>
                    range &&
                    typeof range === 'object' &&
                    range.minAge !== undefined &&
                    range.minAge !== null,
                )
                .map((range) => ({
                  minAge: parseInt(range.minAge?.toString() || '0', 10),
                  maxAge: range.maxAge
                    ? parseInt(range.maxAge.toString(), 10)
                    : null,
                  pricingType: range.pricingType || 'percentage',
                  value: parseFloat(range.value?.toString() || '0'),
                }))
            : [],
        })),
        pickupPoints: formData.pickupPoints
          .filter(
            (point) =>
              point.city &&
              point.city.trim() &&
              point.location &&
              point.location.trim() &&
              point.time &&
              point.time.trim(),
          )
          .map((point, index) => ({
            city: point.city.trim(),
            location: point.location.trim(),
            time: point.time.trim(),
            description: point.description?.trim() || '',
            order: index,
          })),
        startDate: formData.startDate,
        endDate: formData.endDate,
        discount: formData.discount,
      };

      if (step === 'basic') {
        onSubmit(formData);
        return;
      }

      await onSubmit({ ...formDataToSubmit, formData });
    } catch (error) {
      console.error('Form gönderimi hatası:', error);
      const errorMessage = normalizeError(
        error,
        isUpdateMode
          ? 'Tur güncellenirken bir hata oluştu. Lütfen tüm alanları kontrol edip tekrar deneyiniz.'
          : 'Tur oluşturulurken bir hata oluştu. Lütfen tüm alanları kontrol edip tekrar deneyiniz.',
      ).message;
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const target = event.currentTarget;
    if (!target.src.endsWith(IMAGE_PLACEHOLDER)) {
      target.src = IMAGE_PLACEHOLDER;
    }
  };

  // Yeni özellik ekleme
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- add flow wired via preset options
  const handleAddFeature = () => {
    const input = document.getElementById('feature-input') as HTMLInputElement;
    if (input && input.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, input.value.trim()],
      }));
      input.value = '';
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== index),
    }));
  };

  // Yolcu alma noktalarını yönet
  const handlePickupPointsChange = (points: PickupPoint[]) => {
    setFormData((prev) => ({
      ...prev,
      pickupPoints: points.map((point, index) => ({
        ...point,
        order: index,
      })),
    }));
  };

  // Destinasyonları yönet
  const handleDestinationsChange = (
    index: number,
    field: keyof Destination,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.map((dest, idx) =>
        idx === index ? { ...dest, [field]: value } : dest,
      ),
    }));
  };

  // Destinasyonlar değiştiğinde bölgeyi otomatik hesapla
  useEffect(() => {
    if (formData.destinations.length > 0) {
      const selectedCities = formData.destinations
        .map((dest) => dest.city)
        .filter(
          (city): city is string =>
            typeof city === 'string' && city.trim() !== '',
        );

      if (selectedCities.length > 0) {
        let calculatedRegion = '';

        if (selectedCities.length === 1) {
          // Tek şehir varsa o şehrin bölgesini kullan
          calculatedRegion = getRegionByCity(selectedCities[0]);
        } else {
          // Birden fazla şehir varsa akıllı bölge belirleme
          const cityRegions = selectedCities.map((city) =>
            getRegionByCity(city),
          );
          const uniqueRegions = Array.from(new Set(cityRegions)).filter(
            (region) => region,
          );

          if (uniqueRegions.length === 1) {
            // Tüm şehirler aynı bölgedeyse o bölgeyi kullan
            calculatedRegion = uniqueRegions[0];
          } else if (uniqueRegions.length === 2) {
            // İki farklı bölge varsa, komşu bölgeleri kontrol et
            const regionPairs = [
              ['Marmara', 'Ege'],
              ['Ege', 'Akdeniz'],
              ['Akdeniz', 'İç Anadolu'],
              ['İç Anadolu', 'Karadeniz'],
              ['İç Anadolu', 'Doğu Anadolu'],
              ['Doğu Anadolu', 'Güneydoğu Anadolu'],
              ['Karadeniz', 'Doğu Anadolu'],
            ];

            const isNeighboring = regionPairs.some(
              (pair) =>
                (pair[0] === uniqueRegions[0] &&
                  pair[1] === uniqueRegions[1]) ||
                (pair[0] === uniqueRegions[1] && pair[1] === uniqueRegions[0]),
            );

            if (isNeighboring) {
              // Komşu bölgeler varsa, daha büyük olanı seç
              const regionSizes = {
                'İç Anadolu': 12,
                Karadeniz: 16,
                'Doğu Anadolu': 14,
                'Güneydoğu Anadolu': 9,
                Akdeniz: 8,
                Ege: 8,
                Marmara: 11,
              };

              const region1Size =
                regionSizes[uniqueRegions[0] as keyof typeof regionSizes] || 0;
              const region2Size =
                regionSizes[uniqueRegions[1] as keyof typeof regionSizes] || 0;

              calculatedRegion =
                region1Size >= region2Size
                  ? uniqueRegions[0]
                  : uniqueRegions[1];
            } else {
              // Komşu değilse, en çok şehir olan bölgeyi seç
              const regionCounts: { [key: string]: number } = {};
              cityRegions.forEach((region) => {
                if (region) {
                  regionCounts[region] = (regionCounts[region] || 0) + 1;
                }
              });

              calculatedRegion =
                Object.entries(regionCounts).sort(
                  ([, a], [, b]) => b - a,
                )[0]?.[0] || '';
            }
          } else {
            // Üç veya daha fazla farklı bölge varsa, en çok şehir olan bölgeyi seç
            const regionCounts: { [key: string]: number } = {};
            cityRegions.forEach((region) => {
              if (region) {
                regionCounts[region] = (regionCounts[region] || 0) + 1;
              }
            });

            calculatedRegion =
              Object.entries(regionCounts).sort(
                ([, a], [, b]) => b - a,
              )[0]?.[0] || '';
          }
        }

        setFormData((prev) => ({
          ...prev,
          region: calculatedRegion,
        }));
      }
    }
  }, [formData.destinations]);

  // Bugünün tarihini al
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const handleAddAgeRange = (tourDateIndex: number) => {
    const newFormData = { ...formData };
    if (!newFormData.tourDates[tourDateIndex].ageRanges) {
      newFormData.tourDates[tourDateIndex].ageRanges = [];
    }

    // Mevcut yaş aralıklarını sırala
    const sortedRanges = [
      ...newFormData.tourDates[tourDateIndex].ageRanges,
    ].sort((a, b) => a.minAge - b.minAge);

    // Eğer hiç yaş aralığı yoksa, ilk yaş aralığı formdaki minimum yaştan başlasın
    let startAge: number | null =
      sortedRanges.length === 0 ? parseInt(formData.ageRestriction) || 0 : null;
    if (sortedRanges.length > 0) {
      const lastRange = sortedRanges[sortedRanges.length - 1];
      // Son yaş aralığının bitiş yaşı girilmemişse yeni aralık eklenemez
      if (
        lastRange.maxAge === null ||
        lastRange.maxAge === undefined ||
        isNaN(Number(lastRange.maxAge))
      ) {
        alert('Önce mevcut yaş aralığının bitiş yaşını giriniz.');
        return;
      }
      // Son yaş aralığının bitiş yaşı, başlangıç yaşından küçük veya eşit olamaz
      if (lastRange.maxAge <= lastRange.minAge) {
        alert(
          'Mevcut yaş aralığının bitiş yaşı, başlangıç yaşından küçük veya eşit olamaz.',
        );
        return;
      }
      startAge = Number(lastRange.maxAge) + 1;
    }

    // startAge null kontrolü
    if (startAge === null) {
      alert('Yaş aralığı eklenemiyor. Lütfen mevcut aralıkları kontrol edin.');
      return;
    }

    // Yeni yaş aralığı, mevcut aralıklarla çakışıyor mu kontrolü
    for (let i = 0; i < sortedRanges.length; i++) {
      const currentRange = sortedRanges[i];
      if (currentRange.maxAge !== null && startAge <= currentRange.maxAge) {
        alert(
          `Yeni yaş aralığı mevcut yaş aralığı (${currentRange.minAge}-${currentRange.maxAge}) ile çakışıyor. Önce mevcut aralıkları düzenleyin.`,
        );
        return;
      }
    }

    newFormData.tourDates[tourDateIndex].ageRanges.push({
      minAge: startAge,
      maxAge: null,
      pricingType: 'percentage',
      value: '0',
    });

    setFormData(newFormData);
  };

  const validateAgeRanges = (tourDateIndex: number) => {
    const ranges = formData.tourDates[tourDateIndex].ageRanges;
    const sortedRanges = [...ranges].sort((a, b) => a.minAge - b.minAge);
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      const currentRange = sortedRanges[i];
      const nextRange = sortedRanges[i + 1];
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
    value: string | number | null,
  ) => {
    const newFormData = { ...formData };
    const ageRange =
      newFormData.tourDates[tourDateIndex].ageRanges[ageRangeIndex];

    if (field === 'minAge' || field === 'maxAge') {
      const newValue = value === null ? null : Number(value);
      if (field === 'minAge') {
        if (newValue !== null) {
          ageRange.minAge = newValue;
        }
      } else {
        ageRange.maxAge = newValue;
      }
    } else if (field === 'value') {
      ageRange[field] = String(value);
    } else if (field === 'pricingType') {
      ageRange[field] = value as 'free' | 'half' | 'percentage' | 'fixed';
      if (value === 'fixed') {
        ageRange.value = String(
          parseFloat(newFormData.tourDates[tourDateIndex].price) || 0,
        );
      }
    }
    setFormData(newFormData);
  };

  const handleRemoveAgeRange = (
    tourDateIndex: number,
    ageRangeIndex: number,
  ) => {
    const newFormData = { ...formData };
    newFormData.tourDates[tourDateIndex].ageRanges.splice(ageRangeIndex, 1);
    setFormData(newFormData);
  };

  // Üstteki bilgiler değiştiğinde ilk tur tarihi otomatik dolsun
  useEffect(() => {
    if (formData.tourDates.length > 0) {
      const firstDate = formData.tourDates[0];
      const updatedFirstDate: TourDate = {
        ...firstDate,
        price: formData.price,
        availableSeats: formData.maxParticipants.toString(),
        minParticipants: '',
        maxParticipants: formData.maxParticipants.toString(),
        ageRanges: firstDate.ageRanges.map((range) => ({
          ...range,
          value:
            range.pricingType === 'fixed' ? formData.price : range.value || '0',
        })),
      };

      setFormData((prev) => ({
        ...prev,
        tourDates: [updatedFirstDate, ...prev.tourDates.slice(1)],
      }));
    }
  }, [formData.price, formData.maxParticipants]);

  // Görsel ekleme fonksiyonları
  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      void uploadImagesToForm([file], 'main');
      event.target.value = '';
    }
  };

  const handleGalleryImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      void uploadImagesToForm(files, 'gallery');
      event.target.value = '';
    }
  };

  const handleGalleryImageDescriptionChange = (
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((img, idx) =>
        idx === index ? { ...img, description: value } : img,
      ),
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== index),
    }));
  };

  const handleReorderGalleryImages = (from: number, to: number) => {
    setFormData((prev) => {
      const newGalleryImages = [...prev.galleryImages];
      const [movedImage] = newGalleryImages.splice(from, 1);
      newGalleryImages.splice(to, 0, movedImage);
      return {
        ...prev,
        galleryImages: newGalleryImages,
      };
    });
  };

  // Tur tarihleri için handler fonksiyonları tekrar ekliyorum:
  const handleAddTourDate = () => {
    setFormData((prev) => {
      // İlk tur tarihinin bilgilerini al
      const firstTourDate = prev.tourDates[0];

      // Diğer tüm tarihleri kapalı yap
      const updatedTourDates = prev.tourDates.map((td) => ({
        ...td,
        isExpanded: false,
      }));

      // Yeni tur tarihi oluştur, ilk tur tarihinin bilgileriyle
      const newTourDate = {
        ...firstTourDate,
        startDate: '', // Başlangıç tarihi boş
        endDate: '', // Bitiş tarihi boş
        earlyBirdDeadline: '', // Erken rezervasyon son tarihi boş
        lastMinuteStart: '', // Son dakika başlangıç tarihi boş
        earlyBirdDeadlineStart: '', // Erken rezervasyon başlangıç tarihi boş
        earlyBirdDeadlineEnd: '', // Erken rezervasyon bitiş tarihi boş
        lastMinuteStartStart: '', // Son dakika başlangıç tarihi boş
        lastMinuteStartEnd: '', // Son dakika bitiş tarihi boş
        status: 'ACTIVE' as const,
        ageRanges: [...firstTourDate.ageRanges],
        isExpanded: true,
      };

      return {
        ...prev,
        tourDates: [...updatedTourDates, newTourDate],
      };
    });
  };

  const handleTourDateChange = (
    index: number,
    field: keyof TourDate,
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedTourDates = [...prev.tourDates];

      // Eğer başlangıç tarihi değişiyorsa ve gece sayısı varsa
      if (field === 'startDate' && value && prev.nights) {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(prev.nights));

        updatedTourDates[index] = {
          ...updatedTourDates[index],
          startDate: value,
          endDate: endDate.toISOString().split('T')[0],
        };
      } else {
        updatedTourDates[index] = {
          ...updatedTourDates[index],
          [field]: value,
        };
      }

      return {
        ...prev,
        tourDates: updatedTourDates,
      };
    });
  };

  // 1. Handler fonksiyonları ekliyorum:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- legacy multi-select handler
  const handleLanguagesChange = (selected: string[]) => {
    setFormData((prev) => ({ ...prev, languages: selected }));
  };

  const [newTag, setNewTag] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- tag input uses inline add flow
  const handleAddTag = () => {
    const input = document.getElementById('tag-input') as HTMLInputElement;
    if (input && input.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, input.value.trim()],
      }));
      input.value = '';
    }
  };
  const handleRemoveTag = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== idx),
    }));
  };

  // 1. Diller için otomatik tamamlama özelliğini güncelliyorum:
  const [newLanguage, setNewLanguage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const availableLanguages = [
    'Türkçe',
    'İngilizce',
    'Almanca',
    'Fransızca',
    'Rusça',
    'Arapça',
    'İspanyolca',
    'İtalyanca',
    'Çince',
    'Japonca',
  ];

  const handleLanguageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setNewLanguage(value);
    if (value.trim()) {
      const filtered = availableLanguages.filter((lang) =>
        lang.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddLanguage = () => {
    if (
      newLanguage.trim() &&
      availableLanguages.includes(newLanguage.trim()) &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage('');
      setSuggestions([]);
    }
  };

  const handleRemoveLanguage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== idx),
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!formData.languages.includes(suggestion)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, suggestion],
      }));
    }
    setNewLanguage('');
    setSuggestions([]);
  };

  // Program günlerinde fotoğraf ekleme fonksiyonu:
  const handleItineraryImageAdd = (dayIdx: number, files: FileList | null) => {
    if (!files) return;
    void uploadImagesToForm(Array.from(files), 'itinerary', dayIdx);
  };

  const handleItineraryImageRemove = (dayIdx: number, imgIdx: number) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      const day = { ...newItinerary[dayIdx] };
      day.images = (day.images || []).filter((_, i) => i !== imgIdx);
      newItinerary[dayIdx] = day;
      return { ...prev, itinerary: newItinerary };
    });
  };

  // Kalkış şehirlerini yönet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- legacy multi-select handler
  const handleDepartureCityChange = (selectedCities: string[]) => {
    setFormData((prev) => ({
      ...prev,
      departureCity: selectedCities,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- departure city uses inline add flow
  const handleAddDepartureCity = () => {
    const input = document.getElementById(
      'departure-city-input',
    ) as HTMLInputElement;
    if (input && input.value.trim()) {
      const city = input.value.trim();
      if (!formData.departureCity.includes(city)) {
        setFormData((prev) => ({
          ...prev,
          departureCity: [...prev.departureCity, city],
        }));
        input.value = '';
      }
    }
  };

  const handleRemoveDepartureCity = (cityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      departureCity: prev.departureCity.filter((city) => city !== cityToRemove),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Hata Mesajları */}
      {submitError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
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
            <h2 className="text-lg font-medium text-gray-900">
              Temel Bilgiler
            </h2>
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
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
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
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
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
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
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
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

            {/* Kalkış Şehirleri ve Gidilen Yerler */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Kalkış Şehirleri */}
              <div>
                <label
                  htmlFor="departureCity"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Kalkış Şehirleri <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-500">
                    (Birden fazla şehir seçebilirsiniz)
                  </span>
                </label>
                <div className="space-y-3">
                  {/* Mevcut kalkış şehirleri */}
                  {formData.departureCity.map((city, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <select
                          value={city}
                          onChange={(e) => {
                            const newCities = [...formData.departureCity];
                            newCities[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              departureCity: newCities,
                            }));
                          }}
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                        >
                          <option value="">Şehir seçiniz</option>
                          {TURKEY_CITIES.filter(
                            (availableCity) =>
                              !formData.departureCity.some(
                                (selectedCity, i) =>
                                  i !== index && selectedCity === availableCity,
                              ),
                          ).map((availableCity) => (
                            <option key={availableCity} value={availableCity}>
                              {availableCity}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formData.departureCity.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartureCity(city)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="Kalkış şehrini kaldır"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Yeni kalkış şehri ekleme */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        departureCity: [...prev.departureCity, ''],
                      }));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Kalkış Şehri Ekle
                  </button>
                </div>
                {errors.departureCity && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.departureCity}
                  </p>
                )}
              </div>

              {/* Gidilen Yerler */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Gidilen Yerler <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-500">
                    (Birden fazla şehir seçebilirsiniz)
                  </span>
                </label>
                <div className="space-y-3">
                  {/* Mevcut destinasyonlar */}
                  {formData.destinations.map((destination, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <select
                          value={destination.city}
                          onChange={(e) =>
                            handleDestinationsChange(
                              index,
                              'city',
                              e.target.value,
                            )
                          }
                          className="block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                        >
                          <option value="">Şehir seçiniz</option>
                          {TURKEY_CITIES.filter(
                            (city) =>
                              !formData.departureCity.includes(city) &&
                              !formData.destinations.some(
                                (dest, i) => i !== index && dest.city === city,
                              ),
                          ).map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            destinations: prev.destinations.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Destinasyonu kaldır"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Yeni destinasyon ekleme */}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        destinations: [
                          ...prev.destinations,
                          { city: '', description: '' },
                        ],
                      }));
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Destinasyon Ekle
                  </button>
                </div>
                {errors.destinations && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.destinations}
                  </p>
                )}
              </div>
            </div>

            {/* Bölge Bilgisi */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Bölge
                <span className="ml-2 text-xs text-gray-500">
                  (Otomatik hesaplanır)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.region || 'Bölge henüz hesaplanmadı'}
                  disabled
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm bg-gray-100 text-gray-900"
                />
                {formData.destinations.length > 0 &&
                  formData.destinations.some((dest) => dest.city) && (
                    <div className="mt-2 text-xs text-gray-600">
                      <span className="font-medium">Hesaplama:</span>
                      {(() => {
                        const selectedCities = formData.destinations
                          .map((dest) => dest.city)
                          .filter(
                            (city): city is string =>
                              typeof city === 'string' && city.trim() !== '',
                          );

                        if (selectedCities.length === 1) {
                          return ` Tek şehir (${selectedCities[0]}) seçildiği için ${formData.region} bölgesi belirlendi.`;
                        } else {
                          const cityRegions = selectedCities.map((city) =>
                            getRegionByCity(city),
                          );
                          const uniqueRegions = Array.from(
                            new Set(cityRegions),
                          ).filter((region) => region);

                          if (uniqueRegions.length === 1) {
                            return ` Tüm şehirler ${uniqueRegions[0]} bölgesinde olduğu için ${formData.region} bölgesi belirlendi.`;
                          } else if (uniqueRegions.length === 2) {
                            const regionPairs = [
                              ['Marmara', 'Ege'],
                              ['Ege', 'Akdeniz'],
                              ['Akdeniz', 'İç Anadolu'],
                              ['İç Anadolu', 'Karadeniz'],
                              ['İç Anadolu', 'Doğu Anadolu'],
                              ['Doğu Anadolu', 'Güneydoğu Anadolu'],
                              ['Karadeniz', 'Doğu Anadolu'],
                            ];

                            const isNeighboring = regionPairs.some(
                              (pair) =>
                                (pair[0] === uniqueRegions[0] &&
                                  pair[1] === uniqueRegions[1]) ||
                                (pair[0] === uniqueRegions[1] &&
                                  pair[1] === uniqueRegions[0]),
                            );

                            if (isNeighboring) {
                              return ` Komşu bölgeler (${uniqueRegions.join(' - ')}) olduğu için daha büyük olan ${formData.region} bölgesi seçildi.`;
                            } else {
                              return ` Farklı bölgeler (${uniqueRegions.join(', ')}) olduğu için en çok şehir olan ${formData.region} bölgesi seçildi.`;
                            }
                          } else {
                            return ` ${uniqueRegions.length} farklı bölge olduğu için en çok şehir olan ${formData.region} bölgesi seçildi.`;
                          }
                        }
                      })()}
                    </div>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="nights"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Gece <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="nights"
                  name="nights"
                  value={formData.nights}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${errors.nights ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                  placeholder="Örn: 3"
                  min="1"
                />
                {errors.nights && (
                  <p className="mt-2 text-sm text-red-600">{errors.nights}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Gün <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  disabled
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm bg-gray-100 text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="maxParticipants"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
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
                {errors.maxParticipants && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.maxParticipants}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Gidiş Tarihi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    label=""
                    value={formData.startDate}
                    onChange={(val) => {
                      setFormData((prev) => {
                        const updatedTourDates = [...prev.tourDates];
                        if (updatedTourDates.length > 0) {
                          // Başlangıç tarihine gece sayısını ekleyerek dönüş tarihini hesapla
                          const startDate = new Date(val);
                          const endDate = new Date(startDate);
                          endDate.setDate(
                            startDate.getDate() + (parseInt(prev.nights) || 0),
                          );

                          const formattedEndDate = endDate
                            .toISOString()
                            .split('T')[0];

                          updatedTourDates[0] = {
                            ...updatedTourDates[0],
                            startDate: val,
                            endDate: formattedEndDate,
                          };
                        }
                        return {
                          ...prev,
                          startDate: val,
                          endDate: updatedTourDates[0]?.endDate || '',
                          tourDates: updatedTourDates,
                        };
                      });
                    }}
                    placeholder="gg.aa.yyyy"
                    minDate={todayStr}
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-full p-1 border border-gray-200"></div>
                </div>
                {errors.startDate && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Bitiş Tarihi
                </label>
                <div className="relative mt-1">
                  <DatePicker
                    label=""
                    value={formData.endDate}
                    onChange={() => {}} // Değişikliği engelle
                    placeholder="gg.aa.yyyy"
                    minDate={formData.startDate || todayStr}
                    disabled={true} // Düzenlemeyi engelle
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="transportation"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
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
                {errors.transportation && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.transportation}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="tourType"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
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
                {errors.tourType && (
                  <p className="mt-2 text-sm text-red-600">{errors.tourType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label
                    htmlFor="accommodationType"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Konaklama Tipi{' '}
                    {formData.tourType !== 'Günübirlik Tur' && (
                      <span className="text-red-500">*</span>
                    )}
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
                  {errors.accommodationType && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.accommodationType}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="accommodationName"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Konaklama: {formData.accommodationType || ''}
                  </label>
                  <input
                    type="text"
                    id="accommodationName"
                    name="accommodationName"
                    value={formData.accommodationName || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accommodationName: e.target.value,
                      }))
                    }
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder={`Konaklama adı örn. A Oteli`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label
                    htmlFor="ageRestriction"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
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

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Tur Resimleri <span className="text-red-500">*</span>
              </label>
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-gray-300'} px-6 py-8 text-center hover:bg-gray-50`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Resim yüklemek için tıklayın veya sürükleyin
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF dosyaları, 10MB&apos;a kadar
                  </p>
                </div>
              </div>
              {errors.images && (
                <p className="mt-2 text-sm text-red-600">{errors.images}</p>
              )}
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
              {isUploadingImages && (
                <p className="mt-2 text-sm text-sky-600">
                  Görseller yükleniyor...
                </p>
              )}

              {formData.images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element -- blob/local preview must bypass next/image */}
                        <img
                          src={image.preview || image.url || IMAGE_PLACEHOLDER}
                          alt={`Tour image ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={handlePreviewImageError}
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Ana Görsel <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {formData.mainImage && (
                <div className="mt-4 relative w-full max-w-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob/local preview must bypass next/image */}
                  <img
                    src={
                      formData.mainImage.preview ||
                      formData.mainImage.url ||
                      IMAGE_PLACEHOLDER
                    }
                    alt="Ana görsel"
                    className="h-[180px] w-full rounded-lg object-cover"
                    onError={handlePreviewImageError}
                  />
                </div>
              )}
              {errors.mainImage && (
                <p className="mt-2 text-sm text-red-600">{errors.mainImage}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Galeri Görselleri <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500">
                  (En az 3, en fazla 10 görsel)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                disabled={formData.galleryImages.length >= 10}
              />
              {errors.galleryImages && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.galleryImages}
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group border rounded-lg p-2 bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob/local preview must bypass next/image */}
                    <img
                      src={img.preview || img.url || IMAGE_PLACEHOLDER}
                      alt={`Galeri görseli ${idx + 1}`}
                      className="h-[90px] w-full rounded-lg object-cover"
                      onError={handlePreviewImageError}
                    />
                    <input
                      type="text"
                      value={img.description || ''}
                      onChange={(e) =>
                        handleGalleryImageDescriptionChange(idx, e.target.value)
                      }
                      className="mt-2 block w-full rounded border border-gray-300 px-2 py-1 text-xs"
                      placeholder="Açıklama (opsiyonel)"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                    <div className="flex justify-between mt-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleReorderGalleryImages(idx, idx - 1)}
                        className="text-xs px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === formData.galleryImages.length - 1}
                        onClick={() => handleReorderGalleryImages(idx, idx + 1)}
                        className="text-xs px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buluşma Noktası ve Saati */}

            {/* Yolcu Alma Noktaları */}
            <div className="space-y-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Yolcu Alma Noktaları
              </h2>
              <PickupPointForm
                pickupPoints={formData.pickupPoints}
                onChange={handlePickupPointsChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Diller <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={handleLanguageInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLanguage();
                      }
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Dil ekle ve Enter'a bas"
                  />
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="px-4 py-3 rounded-lg bg-indigo-600 text-white"
                  >
                    Ekle
                  </button>
                </div>
                {suggestions.length > 0 && (
                  <ul className="mt-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                    {suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(idx)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.languages && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.languages}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Etiketler
                </label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select
                      value={newTag}
                      onChange={(e) => {
                        const selectedTag = e.target.value;
                        if (
                          selectedTag &&
                          !formData.tags.includes(selectedTag)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, selectedTag],
                          }));
                          setNewTag('');
                        }
                      }}
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="">Etiket seçin</option>
                      {AVAILABLE_TAGS.filter(
                        (tag) => !formData.tags.includes(tag),
                      ).map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detaylar */}
        {step === 'details' && (
          <div className="space-y-6 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Detaylar</h2>

            {/* Dahil Olanlar */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Dahil Olanlar
              </label>
              <div className="mt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {TOUR_OPTIONS.includes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (!formData.includes.includes(item)) {
                          setFormData((prev) => ({
                            ...prev,
                            includes: [...prev.includes, item],
                          }));
                        }
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        formData.includes.includes(item)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newInclude.trim()) {
                        e.preventDefault();
                        if (!formData.includes.includes(newInclude.trim())) {
                          setFormData((prev) => ({
                            ...prev,
                            includes: [...prev.includes, newInclude.trim()],
                          }));
                          setNewInclude('');
                        }
                      }
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Özel dahil olan ekleyin..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        newInclude.trim() &&
                        !formData.includes.includes(newInclude.trim())
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          includes: [...prev.includes, newInclude.trim()],
                        }));
                        setNewInclude('');
                      }
                    }}
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.includes.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveInclude(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dahil Olmayanlar */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Dahil Olmayanlar
              </label>
              <div className="mt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {TOUR_OPTIONS.excludes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (!formData.excludes.includes(item)) {
                          setFormData((prev) => ({
                            ...prev,
                            excludes: [...prev.excludes, item],
                          }));
                        }
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        formData.excludes.includes(item)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newExclude}
                    onChange={(e) => setNewExclude(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newExclude.trim()) {
                        e.preventDefault();
                        if (!formData.excludes.includes(newExclude.trim())) {
                          setFormData((prev) => ({
                            ...prev,
                            excludes: [...prev.excludes, newExclude.trim()],
                          }));
                          setNewExclude('');
                        }
                      }
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Özel dahil olmayan ekleyin..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        newExclude.trim() &&
                        !formData.excludes.includes(newExclude.trim())
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          excludes: [...prev.excludes, newExclude.trim()],
                        }));
                        setNewExclude('');
                      }
                    }}
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.excludes.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveExclude(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağlık Ayrıcalıkları */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Sağlık Ayrıcalıkları
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Bu turda saygı duyulan / desteklenen sağlık durumlarını seçin.
                Seçilmezse tur detayında bu bölüm görünmez.
              </p>
              <div className="mt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {TOUR_OPTIONS.healthPrivileges.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (!formData.healthPrivileges.includes(item)) {
                          setFormData((prev) => ({
                            ...prev,
                            healthPrivileges: [...prev.healthPrivileges, item],
                          }));
                        }
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        formData.healthPrivileges.includes(item)
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="health-privilege-input"
                    value={newHealthPrivilege}
                    onChange={(e) => setNewHealthPrivilege(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newHealthPrivilege.trim()) {
                        e.preventDefault();
                        if (
                          !formData.healthPrivileges.includes(
                            newHealthPrivilege.trim(),
                          )
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            healthPrivileges: [
                              ...prev.healthPrivileges,
                              newHealthPrivilege.trim(),
                            ],
                          }));
                          setNewHealthPrivilege('');
                        }
                      }
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Özel sağlık ayrıcalığı ekleyin..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        newHealthPrivilege.trim() &&
                        !formData.healthPrivileges.includes(
                          newHealthPrivilege.trim(),
                        )
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          healthPrivileges: [
                            ...prev.healthPrivileges,
                            newHealthPrivilege.trim(),
                          ],
                        }));
                        setNewHealthPrivilege('');
                      }
                    }}
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.healthPrivileges.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-800"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveHealthPrivilege(index)}
                        className="text-sky-600 hover:text-sky-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Özellikler */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Özellikler
              </label>
              <div className="mt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {TOUR_OPTIONS.features.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (!formData.features.includes(item)) {
                          setFormData((prev) => ({
                            ...prev,
                            features: [...prev.features, item],
                          }));
                        }
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        formData.features.includes(item)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="feature-input"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newFeature.trim()) {
                        e.preventDefault();
                        if (!formData.features.includes(newFeature.trim())) {
                          setFormData((prev) => ({
                            ...prev,
                            features: [...prev.features, newFeature.trim()],
                          }));
                          setNewFeature('');
                        }
                      }
                    }}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Özel özellik ekleyin..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        newFeature.trim() &&
                        !formData.features.includes(newFeature.trim())
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          features: [...prev.features, newFeature.trim()],
                        }));
                        setNewFeature('');
                      }
                    }}
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Program */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Program
              </label>
              <div className="mt-4 space-y-4">
                {formData.itinerary.map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-md mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) =>
                          handleItineraryChange(index, 'title', e.target.value)
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 text-lg font-semibold"
                        placeholder="Gün başlığı"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(index)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Gün Açıklaması
                      </label>
                      <div
                        data-color-mode="light"
                        className="border border-gray-300 rounded-lg overflow-hidden"
                      >
                        <MDEditor
                          value={day.description}
                          onChange={(val) =>
                            handleItineraryChange(
                              index,
                              'description',
                              val || '',
                            )
                          }
                          height={180}
                          preview="edit"
                          hideToolbar={false}
                          textareaProps={{
                            placeholder:
                              'Bu günün detaylarını açıklayın... Markdown formatında yazabilirsiniz.',
                            style: { fontSize: '14px' },
                          }}
                        />
                      </div>
                    </div>
                    {/* Fotoğraf ekleme alanı */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Gün Fotoğrafları
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleItineraryImageAdd(index, e.target.files)
                        }
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      />
                      {day.images && day.images.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-3">
                          {day.images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative group w-24 h-24"
                            >
                              <img
                                src={img.url}
                                alt="itinerary-img"
                                className="object-cover w-full h-full rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleItineraryImageRemove(index, imgIdx)
                                }
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-80 hover:opacity-100"
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Gün Ekle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tur Tarihleri */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tur Tarihleri</h3>
            <button
              type="button"
              onClick={handleAddTourDate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Yeni Tarih Ekle
            </button>
          </div>

          <div className="space-y-6">
            {formData.tourDates.map((tourDate, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden"
              >
                <div
                  className={`flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors ${tourDate.isExpanded ? 'border-b border-gray-200' : ''}`}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      tourDates: prev.tourDates.map((td, i) => ({
                        ...td,
                        isExpanded: i === index ? !td.isExpanded : false,
                      })),
                    }));
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${tourDate.isExpanded ? 'rotate-180' : ''}`}
                    />
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-lg font-medium text-gray-900">
                          Tur Tarihi {index + 1}
                        </h4>
                        {tourDate.startDate && (
                          <span className="ml-3 text-sm text-gray-600">
                            (
                            {new Date(tourDate.startDate).toLocaleDateString(
                              'tr-TR',
                            )}{' '}
                            -{' '}
                            {new Date(tourDate.endDate).toLocaleDateString(
                              'tr-TR',
                            )}
                            )
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {tourDate.price && `${tourDate.price}₺`}
                        {tourDate.availableSeats &&
                          ` • ${tourDate.availableSeats} kişilik kontenjan`}
                        {tourDate.soldSeats &&
                          parseInt(tourDate.soldSeats) > 0 &&
                          ` • ${tourDate.soldSeats} kişi satıldı`}
                      </div>
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            'Bu tur tarihini silmek istediğinize emin misiniz?',
                          )
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            tourDates: prev.tourDates.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }
                      }}
                      className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors ml-4"
                      title="Tur tarihini sil"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      <span>Sil</span>
                    </button>
                  )}
                </div>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    tourDate.isExpanded
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Başlangıç Tarihi
                        </label>
                        <div className="relative mt-1">
                          <DatePicker
                            label=""
                            value={tourDate.startDate}
                            onChange={(val) =>
                              handleTourDateChange(index, 'startDate', val)
                            }
                            placeholder="gg.aa.yyyy"
                            minDate={todayStr}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Bitiş Tarihi
                        </label>
                        <div className="relative mt-1">
                          <DatePicker
                            label=""
                            value={tourDate.endDate}
                            onChange={(val) =>
                              handleTourDateChange(index, 'endDate', val)
                            }
                            placeholder="gg.aa.yyyy"
                            minDate={tourDate.startDate || todayStr}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Fiyat
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.price}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'price',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Kontenjan
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.availableSeats}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'availableSeats',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Satılan Koltuk
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.soldSeats || ''}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'soldSeats',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Min. Katılımcı
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.minParticipants}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'minParticipants',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Max. Katılımcı
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.maxParticipants || ''}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'maxParticipants',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Erken Rezervasyon İndirimi (%)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.earlyBirdDiscount || ''}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'earlyBirdDiscount',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Son Dakika İndirimi (%)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            value={tourDate.lastMinuteDiscount || ''}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'lastMinuteDiscount',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>

                      {/* Erken Rezervasyon Tarihleri */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Erken Rez. Başlangıç
                        </label>
                        <div className="relative mt-1">
                          <DatePicker
                            label=""
                            value={tourDate.earlyBirdDeadlineStart}
                            onChange={(val) =>
                              handleTourDateChange(
                                index,
                                'earlyBirdDeadlineStart',
                                val,
                              )
                            }
                            placeholder="gg.aa.yyyy"
                            maxDate={tourDate.startDate || undefined}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Erken Rez. Bitiş
                        </label>
                        <div className="relative mt-1">
                          <DatePicker
                            label=""
                            value={tourDate.earlyBirdDeadlineEnd}
                            onChange={(val) =>
                              handleTourDateChange(
                                index,
                                'earlyBirdDeadlineEnd',
                                val,
                              )
                            }
                            placeholder="gg.aa.yyyy"
                            minDate={
                              tourDate.earlyBirdDeadlineStart || undefined
                            }
                            maxDate={tourDate.startDate || undefined}
                          />
                        </div>
                      </div>

                      {/* Son Dakika Tarihleri */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Son Dakika Başlangıç
                        </label>
                        <div className="relative mt-1">
                          <DatePicker
                            label=""
                            value={tourDate.lastMinuteStartStart}
                            onChange={(val) =>
                              handleTourDateChange(
                                index,
                                'lastMinuteStartStart',
                                val,
                              )
                            }
                            placeholder="gg.aa.yyyy"
                            minDate={tourDate.earlyBirdDeadlineEnd || undefined}
                            maxDate={tourDate.startDate || undefined}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Son Dakika Bitiş
                        </label>
                        <div className="relative mt-1">
                          <DatePicker
                            label=""
                            value={tourDate.lastMinuteStartEnd}
                            onChange={(val) =>
                              handleTourDateChange(
                                index,
                                'lastMinuteStartEnd',
                                val,
                              )
                            }
                            placeholder="gg.aa.yyyy"
                            minDate={tourDate.lastMinuteStartStart || undefined}
                            maxDate={tourDate.startDate || undefined}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Durum
                        </label>
                        <div className="mt-1">
                          <select
                            value={tourDate.status}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'status',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                          >
                            <option value="ACTIVE">Aktif</option>
                            <option value="CANCELLED">İptal</option>
                            <option value="COMPLETED">Tamamlandı</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Notlar
                        </label>
                        <div className="mt-1">
                          <textarea
                            value={tourDate.notes}
                            onChange={(e) =>
                              handleTourDateChange(
                                index,
                                'notes',
                                e.target.value,
                              )
                            }
                            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Yaş Aralıkları */}
                    <div className="col-span-2">
                      <h4 className="text-sm font-semibold mb-2">
                        Yaş Aralıkları
                      </h4>
                      {tourDate.ageRanges?.map((ageRange, ageIndex) => (
                        <div
                          key={ageIndex}
                          className="flex gap-3 items-start mb-3 bg-white p-4 rounded-lg border border-neutral-200 shadow-sm"
                        >
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
                              className={`w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-800 placeholder-neutral-400 ${ageIndex > 0 ? 'bg-neutral-100 cursor-not-allowed' : 'focus:border-sky-500 focus:ring-1 focus:ring-sky-500'}`}
                              placeholder={ageIndex === 0 ? 'Örn: 3' : ''}
                              onChange={(e) => {
                                if (ageIndex === 0) {
                                  const value = e.target.value.replace(
                                    /^0+/,
                                    '',
                                  );
                                  if (value === '' || /^\d+$/.test(value)) {
                                    handleAgeRangeChange(
                                      index,
                                      ageIndex,
                                      'minAge',
                                      value ? Number(value) : 0,
                                    );
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
                                  handleAgeRangeChange(
                                    index,
                                    ageIndex,
                                    'maxAge',
                                    value ? Number(value) : null,
                                  );
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
                              onChange={(e) =>
                                handleAgeRangeChange(
                                  index,
                                  ageIndex,
                                  'pricingType',
                                  e.target.value,
                                )
                              }
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
                              {ageRange.pricingType === 'percentage'
                                ? 'İndirim Oranı (%)'
                                : ageRange.pricingType === 'fixed'
                                  ? 'Sabit Fiyat (₺)'
                                  : 'Değer'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={
                                ageRange.pricingType === 'percentage'
                                  ? 100
                                  : undefined
                              }
                              value={ageRange.value}
                              onChange={(e) =>
                                handleAgeRangeChange(
                                  index,
                                  ageIndex,
                                  'value',
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-800 placeholder-neutral-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                              placeholder={
                                ageRange.pricingType === 'percentage'
                                  ? 'Örn: 50'
                                  : 'Örn: 1000'
                              }
                              disabled={
                                ageRange.pricingType === 'free' ||
                                ageRange.pricingType === 'half'
                              }
                            />
                          </div>
                          <div className="flex flex-col items-center justify-center mt-6">
                            <span className="text-sm font-medium text-neutral-700 mb-1">
                              {ageRange.maxAge
                                ? `${ageRange.minAge}-${ageRange.maxAge} Yaş`
                                : `${ageRange.minAge}+ Yaş`}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAgeRange(index, ageIndex)
                              }
                              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                              title="Yaş aralığını sil"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          if (!validateAgeRanges(index)) {
                            alert(
                              'Yaş aralıkları arasında çakışma var. Lütfen önce mevcut aralıkları düzenleyin.',
                            );
                            return;
                          }
                          handleAddAgeRange(index);
                        }}
                        className="mt-2 inline-flex items-center text-sm text-sky-600 hover:text-sky-800 font-medium bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Yaş Aralığı Ekle
                      </button>
                    </div>
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
            disabled={isSubmitting || isUploadingImages}
            className="px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            İptal
          </button>

          <div className="flex gap-4">
            {step === 'basic' ? (
              <button
                type="button"
                onClick={async () => {
                  const isValid = await validateForm();
                  if (isValid) {
                    window.scrollTo(0, 0);
                    setStep('details');
                  }
                }}
                disabled={isSubmitting || isUploadingImages}
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
                  disabled={isSubmitting || isUploadingImages}
                  className="px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Geri Dön
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImages}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Kaydediliyor...
                    </>
                  ) : isUpdateMode ? (
                    'Değişiklikleri Kaydet'
                  ) : (
                    'Turu Oluştur'
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

export default TourForm;
