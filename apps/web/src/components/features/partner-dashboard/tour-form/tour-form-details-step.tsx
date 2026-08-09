'use client';

import { Plus, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TOUR_OPTIONS } from './tour-form.constants';
import { useTourFormUi } from './tour-form-context';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

/** Split from tour-form.tsx (Faz 7) — Detaylar step; UI unchanged. */
export function TourFormDetailsStep() {
  const {
    formData,
    setFormData,
    newInclude,
    setNewInclude,
    newExclude,
    setNewExclude,
    newHealthPrivilege,
    setNewHealthPrivilege,
    newFeature,
    setNewFeature,
    handleRemoveInclude,
    handleRemoveExclude,
    handleRemoveHealthPrivilege,
    handleRemoveFeature,
    handleItineraryChange,
    handleAddItineraryDay,
    handleRemoveItineraryDay,
    handleItineraryImageAdd,
    handleItineraryImageRemove,
  } = useTourFormUi();

  return (
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
                  !formData.healthPrivileges.includes(newHealthPrivilege.trim())
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
                      handleItineraryChange(index, 'description', val || '')
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
                      <div key={imgIdx} className="relative group w-24 h-24">
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
  );
}
