'use client';

import { ChevronDown, Plus, Trash2, X } from 'lucide-react';
import { DatePicker } from '@/components/booking/date-picker';
import { useTourFormUi } from './tour-form-context';

/** Split from tour-form.tsx (Faz 7) — Tur Tarihleri (always visible); UI unchanged. */
export function TourFormDatesSection() {
  const {
    formData,
    setFormData,
    todayStr,
    handleAddTourDate,
    handleTourDateChange,
    handleAddAgeRange,
    handleRemoveAgeRange,
    handleAgeRangeChange,
    validateAgeRanges,
  } = useTourFormUi();

  return (
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
                        {new Date(tourDate.endDate).toLocaleDateString('tr-TR')}
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
                        tourDates: prev.tourDates.filter((_, i) => i !== index),
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
                          handleTourDateChange(index, 'price', e.target.value)
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
                        minDate={tourDate.earlyBirdDeadlineStart || undefined}
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
                          handleTourDateChange(index, 'lastMinuteStartEnd', val)
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
                          handleTourDateChange(index, 'status', e.target.value)
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
                          handleTourDateChange(index, 'notes', e.target.value)
                        }
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Yaş Aralıkları */}
                <div className="col-span-2">
                  <h4 className="text-sm font-semibold mb-2">Yaş Aralıkları</h4>
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
                              const value = e.target.value.replace(/^0+/, '');
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
                          onClick={() => handleRemoveAgeRange(index, ageIndex)}
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
  );
}
