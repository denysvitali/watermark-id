import { beforeEach, describe, expect, it } from 'vitest'
import type { CropSettings, ExportSettings, WatermarkSettings } from '../types'
import {
  applyPreset,
  createPreset,
  loadPreset,
  PRESET_STORAGE_KEY,
  presetsMatch,
  savePreset,
} from './preset'

const watermark: WatermarkSettings = {
  company: 'Northstar Bank',
  purpose: 'Identity verification',
  includeDate: true,
  date: '2025-01-01',
  color: '#ffffff',
  opacity: 34,
  fontSize: 4.5,
  spacing: 24,
  angle: -28,
  pattern: 'diagonal',
}

const crop: CropSettings = {
  enabled: true,
  zoom: 1.3,
  focusX: 0.2,
  focusY: 0.8,
}

const exportSettings: ExportSettings = {
  format: 'image/jpeg',
  quality: 92,
}

describe('default presets', () => {
  beforeEach(() => localStorage.clear())

  it('stores reusable settings without freezing the date or crop position', () => {
    const preset = createPreset(watermark, crop, exportSettings)
    savePreset(localStorage, preset)
    const loaded = loadPreset(localStorage)
    const applied = applyPreset(loaded!, '2026-08-12')

    expect(applied.watermark.date).toBe('2026-08-12')
    expect(applied.watermark.company).toBe('Northstar Bank')
    expect(applied.crop).toEqual({ enabled: true, zoom: 1.3, focusX: 0.5, focusY: 0.5 })
  })

  it('ignores malformed stored data', () => {
    localStorage.setItem(PRESET_STORAGE_KEY, '{"version":1,"watermark":{}}')
    expect(loadPreset(localStorage)).toBeNull()
  })

  it('detects when current settings still match the saved preset', () => {
    const preset = createPreset(watermark, crop, exportSettings)
    expect(presetsMatch(preset, createPreset(watermark, crop, exportSettings))).toBe(true)
    expect(
      presetsMatch(preset, createPreset({ ...watermark, opacity: 60 }, crop, exportSettings)),
    ).toBe(false)
  })
})

