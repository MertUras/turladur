'use client';

import RequiredMark from '@/app/components/RequiredMark';
import {
  ACCESSIBILITY_OPTIONS,
  CELEBRATION_OPTIONS,
  CHILD_BABY_OPTIONS,
  LANGUAGE_OPTIONS,
  MAX_SPECIAL_CONDITION_TEXT,
  NUTRITION_OPTIONS,
  SPECIAL_CONDITION_OPTIONS,
  SpecialConditionKey,
  SpecialConditionsData,
  TRANSFER_OPTIONS,
} from '@/app/lib/special-conditions';

interface SpecialConditionsSectionProps {
  value: SpecialConditionsData;
  onChange: (value: SpecialConditionsData) => void;
  requiresEquipment: boolean;
  errors: Record<string, string>;
}

const inputClass =
  'w-full py-2.5 px-4 border border-neutral-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-neutral-900';
const chipClass = (selected: boolean) =>
  `px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
    selected
      ? 'border-sky-600 bg-sky-50/60 text-sky-800'
      : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
  }`;

function toggleOption(options: string[], option: string): string[] {
  return options.includes(option)
    ? options.filter((o) => o !== option)
    : [...options, option];
}

function updateMultiSelect(
  data: SpecialConditionsData,
  key: keyof SpecialConditionsData['details'],
  updater: (current: { options: string[]; other?: string }) => { options: string[]; other?: string }
): SpecialConditionsData {
  const current = (data.details[key] as { options?: string[]; other?: string }) || { options: [] };
  return {
    ...data,
    details: {
      ...data.details,
      [key]: updater({ options: current.options || [], other: current.other }),
    },
  };
}

export default function SpecialConditionsSection({
  value,
  onChange,
  requiresEquipment,
  errors,
}: SpecialConditionsSectionProps) {
  const visibleOptions = SPECIAL_CONDITION_OPTIONS.filter(
    (opt) => !opt.requiresEquipment || requiresEquipment
  );

  const toggleCondition = (id: SpecialConditionKey) => {
    if (id === 'none') {
      onChange({ selected: ['none'], details: {} });
      return;
    }

    const withoutNone = value.selected.filter((s) => s !== 'none');
    const isSelected = withoutNone.includes(id);
    const selected = isSelected ? withoutNone.filter((s) => s !== id) : [...withoutNone, id];

    const details = { ...value.details };
    if (isSelected) {
      delete details[id as keyof typeof details];
    }

    onChange({ selected, details });
  };

  const isSelected = (id: SpecialConditionKey) => value.selected.includes(id);

  const renderChips = (
    options: string[],
    selected: string[],
    onToggle: (option: string) => void
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={chipClass(selected.includes(option))}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const hasActiveConditions =
    value.selected.length > 0 && !value.selected.includes('none');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-neutral-900">
          Özel Durumlar ve Talepler
          {hasActiveConditions && <RequiredMark />}
        </h3>
        <p className="text-sm text-neutral-600 mt-1">
          Tur operatörünün önceden bilmesi gereken durumları seçebilirsin. Birden fazla seçim
          yapabilirsin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => toggleCondition(option.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all ${
              isSelected(option.id)
                ? 'border-sky-600 bg-sky-50/60'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <p className="text-sm font-medium text-neutral-900">{option.label}</p>
          </button>
        ))}
      </div>

      {isSelected('nutrition') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">
            Beslenme tercihi
            <RequiredMark />
          </p>
          {renderChips(NUTRITION_OPTIONS, value.details.nutrition?.options || [], (option) =>
            onChange(
              updateMultiSelect(value, 'nutrition', (current) => ({
                ...current,
                options: toggleOption(current.options, option),
              }))
            )
          )}
          {value.details.nutrition?.options?.includes('Diğer') && (
            <input
              type="text"
              value={value.details.nutrition?.other || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  details: {
                    ...value.details,
                    nutrition: {
                      options: value.details.nutrition?.options || [],
                      other: e.target.value,
                    },
                  },
                })
              }
              className={inputClass}
              placeholder="Beslenme tercihinizi belirtin"
            />
          )}
          {errors.nutrition && <p className="text-sm text-red-600">{errors.nutrition}</p>}
        </div>
      )}

      {isSelected('allergy') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-2">
          <label className="block text-sm font-medium text-neutral-800">
            Alerjinizi ve gerekli önlemleri belirtin
            <RequiredMark />
          </label>
          <textarea
            rows={3}
            value={value.details.allergy || ''}
            onChange={(e) =>
              onChange({
                ...value,
                details: { ...value.details, allergy: e.target.value },
              })
            }
            className={inputClass}
            placeholder="Alerji bilgilerinizi yazın"
          />
          {errors.allergy && <p className="text-sm text-red-600">{errors.allergy}</p>}
        </div>
      )}

      {isSelected('health') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-2">
          <label className="block text-sm font-medium text-neutral-800">
            Sağlık durumu <span className="text-neutral-400 font-normal">(isteğe bağlı)</span>
          </label>
          <textarea
            rows={3}
            value={value.details.health || ''}
            onChange={(e) =>
              onChange({
                ...value,
                details: { ...value.details, health: e.target.value },
              })
            }
            className={inputClass}
            placeholder="Operatörün bilmesi gereken sağlık durumunuz"
          />
          {errors.health && <p className="text-sm text-red-600">{errors.health}</p>}
        </div>
      )}

      {isSelected('accessibility') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">
            Erişilebilirlik ihtiyacı
            <RequiredMark />
          </p>
          {renderChips(
            ACCESSIBILITY_OPTIONS,
            value.details.accessibility?.options || [],
            (option) =>
              onChange(
                updateMultiSelect(value, 'accessibility', (current) => ({
                  ...current,
                  options: toggleOption(current.options, option),
                }))
              )
          )}
          {value.details.accessibility?.options?.includes('Diğer') && (
            <input
              type="text"
              value={value.details.accessibility?.other || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  details: {
                    ...value.details,
                    accessibility: {
                      options: value.details.accessibility?.options || [],
                      other: e.target.value,
                    },
                  },
                })
              }
              className={inputClass}
              placeholder="Erişilebilirlik ihtiyacınızı belirtin"
            />
          )}
          {errors.accessibility && <p className="text-sm text-red-600">{errors.accessibility}</p>}
        </div>
      )}

      {isSelected('child_baby') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">
            Çocuk veya bebek ile katılım
            <RequiredMark />
          </p>
          {renderChips(CHILD_BABY_OPTIONS, value.details.child_baby?.options || [], (option) =>
            onChange(
              updateMultiSelect(value, 'child_baby', (current) => ({
                ...current,
                options: toggleOption(current.options, option),
              }))
            )
          )}
          {value.details.child_baby?.options?.includes('Diğer') && (
            <input
              type="text"
              value={value.details.child_baby?.other || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  details: {
                    ...value.details,
                    child_baby: {
                      options: value.details.child_baby?.options || [],
                      other: e.target.value,
                    },
                  },
                })
              }
              className={inputClass}
              placeholder="Ek bilgi belirtin"
            />
          )}
          {errors.child_baby && <p className="text-sm text-red-600">{errors.child_baby}</p>}
        </div>
      )}

      {isSelected('pregnancy') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-2">
          <label className="block text-sm font-medium text-neutral-800">
            Hamilelik haftası <span className="text-neutral-400 font-normal">(isteğe bağlı)</span>
          </label>
          <input
            type="number"
            min={1}
            max={42}
            value={value.details.pregnancy?.week || ''}
            onChange={(e) =>
              onChange({
                ...value,
                details: {
                  ...value.details,
                  pregnancy: { week: e.target.value },
                },
              })
            }
            className={inputClass}
            placeholder="Örn. 24"
          />
          {errors.pregnancy && <p className="text-sm text-red-600">{errors.pregnancy}</p>}
        </div>
      )}

      {isSelected('transfer') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">
            Transfer veya buluşma noktası
            <RequiredMark />
          </p>
          {renderChips(TRANSFER_OPTIONS, value.details.transfer?.options || [], (option) =>
            onChange(
              updateMultiSelect(value, 'transfer', (current) => ({
                ...current,
                options: toggleOption(current.options, option),
              }))
            )
          )}
          {(value.details.transfer?.options?.includes('Otelden alım talebi') ||
            value.details.transfer?.options?.includes('Farklı buluşma noktası')) && (
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                Konum / otel bilgisi
                <RequiredMark />
              </label>
              <input
                type="text"
                value={value.details.transfer?.location || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    details: {
                      ...value.details,
                      transfer: {
                        options: value.details.transfer?.options || [],
                        other: value.details.transfer?.other,
                        location: e.target.value,
                      },
                    },
                  })
                }
                className={inputClass}
                placeholder="Otel adı veya buluşma noktası"
              />
            </div>
          )}
          {value.details.transfer?.options?.includes('Diğer') && (
            <input
              type="text"
              value={value.details.transfer?.other || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  details: {
                    ...value.details,
                    transfer: {
                      options: value.details.transfer?.options || [],
                      location: value.details.transfer?.location,
                      other: e.target.value,
                    },
                  },
                })
              }
              className={inputClass}
              placeholder="Transfer talebinizi belirtin"
            />
          )}
          {errors.transfer && <p className="text-sm text-red-600">{errors.transfer}</p>}
          {errors.transferLocation && (
            <p className="text-sm text-red-600">{errors.transferLocation}</p>
          )}
        </div>
      )}

      {isSelected('language') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">
            Dil tercihi
            <RequiredMark />
          </p>
          {renderChips(LANGUAGE_OPTIONS, value.details.language?.options || [], (option) =>
            onChange(
              updateMultiSelect(value, 'language', (current) => ({
                ...current,
                options: toggleOption(current.options, option),
              }))
            )
          )}
          {value.details.language?.options?.includes('Diğer') && (
            <input
              type="text"
              value={value.details.language?.other || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  details: {
                    ...value.details,
                    language: {
                      options: value.details.language?.options || [],
                      other: e.target.value,
                    },
                  },
                })
              }
              className={inputClass}
              placeholder="Dil tercihinizi belirtin"
            />
          )}
          {errors.language && <p className="text-sm text-red-600">{errors.language}</p>}
        </div>
      )}

      {isSelected('celebration') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">
            Özel gün veya kutlama
            <RequiredMark />
          </p>
          {renderChips(CELEBRATION_OPTIONS, value.details.celebration?.options || [], (option) =>
            onChange(
              updateMultiSelect(value, 'celebration', (current) => ({
                ...current,
                options: toggleOption(current.options, option),
              }))
            )
          )}
          {value.details.celebration?.options?.includes('Diğer') && (
            <input
              type="text"
              value={value.details.celebration?.other || ''}
              onChange={(e) =>
                onChange({
                  ...value,
                  details: {
                    ...value.details,
                    celebration: {
                      options: value.details.celebration?.options || [],
                      other: e.target.value,
                    },
                  },
                })
              }
              className={inputClass}
              placeholder="Kutlama detayını belirtin"
            />
          )}
          {errors.celebration && <p className="text-sm text-red-600">{errors.celebration}</p>}
        </div>
      )}

      {isSelected('equipment') && requiresEquipment && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-3">
          <p className="text-sm font-medium text-neutral-800">Ekipman veya beden ölçüsü</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Boy (cm)</label>
              <input
                type="text"
                value={value.details.equipment?.height || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    details: {
                      ...value.details,
                      equipment: { ...value.details.equipment, height: e.target.value },
                    },
                  })
                }
                className={inputClass}
                placeholder="175"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Kilo (kg)</label>
              <input
                type="text"
                value={value.details.equipment?.weight || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    details: {
                      ...value.details,
                      equipment: { ...value.details.equipment, weight: e.target.value },
                    },
                  })
                }
                className={inputClass}
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Ayakkabı no.</label>
              <input
                type="text"
                value={value.details.equipment?.shoeSize || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    details: {
                      ...value.details,
                      equipment: { ...value.details.equipment, shoeSize: e.target.value },
                    },
                  })
                }
                className={inputClass}
                placeholder="42"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Beden</label>
              <input
                type="text"
                value={value.details.equipment?.clothingSize || ''}
                onChange={(e) =>
                  onChange({
                    ...value,
                    details: {
                      ...value.details,
                      equipment: { ...value.details.equipment, clothingSize: e.target.value },
                    },
                  })
                }
                className={inputClass}
                placeholder="M / L"
              />
            </div>
          </div>
        </div>
      )}

      {isSelected('other') && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-2">
          <label className="block text-sm font-medium text-neutral-800">
            Diğer talepleriniz
            <RequiredMark />
          </label>
          <textarea
            rows={3}
            maxLength={MAX_SPECIAL_CONDITION_TEXT}
            value={value.details.other || ''}
            onChange={(e) =>
              onChange({
                ...value,
                details: { ...value.details, other: e.target.value },
              })
            }
            className={inputClass}
            placeholder="Operatörün bilmesi gereken diğer durumlar"
          />
          <p className="text-xs text-neutral-500 text-right">
            {(value.details.other || '').length}/{MAX_SPECIAL_CONDITION_TEXT}
          </p>
          {errors.other && <p className="text-sm text-red-600">{errors.other}</p>}
        </div>
      )}

      <div className="space-y-2 pt-2">
        <p className="text-xs text-neutral-500">
          Paylaştığınız bilgiler yalnızca rezervasyonun hazırlanması ve tur deneyiminizin
          kişiselleştirilmesi amacıyla kullanılacaktır.
        </p>
        <p className="text-xs text-neutral-500">
          Talepleriniz tur operatörüne iletilecektir; müsaitlik ve operasyonel koşullara bağlı olarak
          karşılanabilir.
        </p>
      </div>
    </div>
  );
}
