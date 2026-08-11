import type {
  CropSettings,
  ExportSettings,
  WatermarkSettings,
} from '../types'

export const PRESET_STORAGE_KEY = 'watermark-id:default-preset:v1'

export interface StoredPreset {
  version: 1
  watermark: Omit<WatermarkSettings, 'date'>
  crop: Pick<CropSettings, 'enabled' | 'zoom'>
  exportSettings: ExportSettings
}

export interface AppliedPreset {
  watermark: WatermarkSettings
  crop: CropSettings
  exportSettings: ExportSettings
}

export function createPreset(
  watermark: WatermarkSettings,
  crop: CropSettings,
  exportSettings: ExportSettings,
): StoredPreset {
  const { date: _date, ...watermarkWithoutDate } = watermark
  return {
    version: 1,
    watermark: watermarkWithoutDate,
    crop: {
      enabled: crop.enabled,
      zoom: crop.zoom,
    },
    exportSettings: { ...exportSettings },
  }
}

export function savePreset(storage: Storage, preset: StoredPreset) {
  storage.setItem(PRESET_STORAGE_KEY, JSON.stringify(preset))
}

export function loadPreset(storage: Storage): StoredPreset | null {
  try {
    const value = storage.getItem(PRESET_STORAGE_KEY)
    if (!value) return null
    const parsed = JSON.parse(value) as Partial<StoredPreset>

    if (
      parsed.version !== 1 ||
      !parsed.watermark ||
      typeof parsed.watermark.company !== 'string' ||
      typeof parsed.watermark.purpose !== 'string' ||
      typeof parsed.watermark.includeDate !== 'boolean' ||
      typeof parsed.watermark.color !== 'string' ||
      typeof parsed.watermark.opacity !== 'number' ||
      typeof parsed.watermark.fontSize !== 'number' ||
      typeof parsed.watermark.spacing !== 'number' ||
      typeof parsed.watermark.angle !== 'number' ||
      !['diagonal', 'horizontal', 'focus'].includes(parsed.watermark.pattern ?? '') ||
      !parsed.crop ||
      typeof parsed.crop.enabled !== 'boolean' ||
      typeof parsed.crop.zoom !== 'number' ||
      !parsed.exportSettings ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(parsed.exportSettings.format ?? '') ||
      typeof parsed.exportSettings.quality !== 'number'
    ) {
      return null
    }

    return parsed as StoredPreset
  } catch {
    return null
  }
}

export function applyPreset(preset: StoredPreset, date: string): AppliedPreset {
  return {
    watermark: {
      ...preset.watermark,
      date,
    },
    crop: {
      ...preset.crop,
      focusX: 0.5,
      focusY: 0.5,
    },
    exportSettings: { ...preset.exportSettings },
  }
}

export function presetsMatch(left: StoredPreset | null, right: StoredPreset) {
  return left !== null && JSON.stringify(left) === JSON.stringify(right)
}

