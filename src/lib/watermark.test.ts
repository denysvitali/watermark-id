import { describe, expect, it } from 'vitest'
import type { CropSettings, WatermarkSettings } from '../types'
import {
  formatDateLabel,
  getCropRect,
  getOutputSize,
  getWatermarkText,
  ID_CARD_RATIO,
  safeFileStem,
} from './watermark'

const crop: CropSettings = {
  enabled: true,
  zoom: 1,
  focusX: 0.5,
  focusY: 0.5,
}

describe('ID-1 crop geometry', () => {
  it('centers an ID-1 crop within a landscape image', () => {
    const rect = getCropRect(2000, 1000, crop)

    expect(rect.width / rect.height).toBeCloseTo(ID_CARD_RATIO)
    expect(rect.height).toBe(1000)
    expect(rect.x).toBeCloseTo((2000 - rect.width) / 2)
    expect(rect.y).toBe(0)
  })

  it('centers an ID-1 crop within a portrait image', () => {
    const rect = getCropRect(1000, 2000, crop)

    expect(rect.width).toBe(1000)
    expect(rect.width / rect.height).toBeCloseTo(ID_CARD_RATIO)
    expect(rect.x).toBe(0)
    expect(rect.y).toBeCloseTo((2000 - rect.height) / 2)
  })

  it('zooms toward the selected focus point', () => {
    const rect = getCropRect(2000, 1000, {
      ...crop,
      zoom: 2,
      focusX: 1,
      focusY: 0,
    })

    expect(rect.height).toBe(500)
    expect(rect.x + rect.width).toBeCloseTo(2000)
    expect(rect.y).toBe(0)
  })

  it('preserves the source when cropping is off', () => {
    expect(getCropRect(4032, 3024, { ...crop, enabled: false })).toEqual({
      x: 0,
      y: 0,
      width: 4032,
      height: 3024,
    })
  })
})

describe('watermark output helpers', () => {
  it('limits very large exports without changing their ratio', () => {
    const output = getOutputSize({ x: 0, y: 0, width: 8000, height: 4000 })
    expect(output).toEqual({ width: 4096, height: 2048 })
  })

  it('formats a user-selected date without a UTC shift', () => {
    expect(formatDateLabel('2026-08-11', 'en-GB')).toBe('11 AUG 2026')
  })

  it('composes purpose, company, and date', () => {
    const settings: WatermarkSettings = {
      company: 'Northstar Bank',
      purpose: 'Identity verification',
      includeDate: true,
      date: '2026-08-11',
      color: '#ffffff',
      opacity: 30,
      fontSize: 4,
      spacing: 20,
      angle: -25,
      pattern: 'diagonal',
    }

    expect(getWatermarkText(settings, 'en-GB')).toBe(
      'IDENTITY VERIFICATION  •  NORTHSTAR BANK  •  11 AUG 2026',
    )
  })

  it('creates safe download names', () => {
    expect(safeFileStem('My identity photo (front).jpg')).toBe('My-identity-photo-front')
  })
})

