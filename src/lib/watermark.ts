import type {
  CropSettings,
  ExportFormat,
  SourceRect,
  WatermarkSettings,
} from '../types'

export const ID_CARD_WIDTH_MM = 85.6
export const ID_CARD_HEIGHT_MM = 53.98
export const ID_CARD_RATIO = ID_CARD_WIDTH_MM / ID_CARD_HEIGHT_MM
export const MAX_EXPORT_EDGE = 4096

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function getCropRect(
  sourceWidth: number,
  sourceHeight: number,
  crop: CropSettings,
): SourceRect {
  if (!crop.enabled) {
    return { x: 0, y: 0, width: sourceWidth, height: sourceHeight }
  }

  const sourceRatio = sourceWidth / sourceHeight
  let baseWidth: number
  let baseHeight: number

  if (sourceRatio > ID_CARD_RATIO) {
    baseHeight = sourceHeight
    baseWidth = sourceHeight * ID_CARD_RATIO
  } else {
    baseWidth = sourceWidth
    baseHeight = sourceWidth / ID_CARD_RATIO
  }

  const zoom = clamp(crop.zoom, 1, 3)
  const width = baseWidth / zoom
  const height = baseHeight / zoom
  const x = (sourceWidth - width) * clamp(crop.focusX, 0, 1)
  const y = (sourceHeight - height) * clamp(crop.focusY, 0, 1)

  return { x, y, width, height }
}

export function getOutputSize(rect: SourceRect, maxEdge = MAX_EXPORT_EDGE) {
  const scale = Math.min(1, maxEdge / Math.max(rect.width, rect.height))
  return {
    width: Math.max(1, Math.round(rect.width * scale)),
    height: Math.max(1, Math.round(rect.height * scale)),
  }
}

export function formatDateLabel(dateValue: string, locale?: string) {
  if (!dateValue) return ''

  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return ''

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(year, month - 1, day))
    .toLocaleUpperCase(locale)
}

export function getWatermarkText(
  settings: WatermarkSettings,
  locale?: string,
) {
  const segments = [
    settings.purpose.trim(),
    settings.company.trim() || 'TARGET COMPANY',
  ]

  if (settings.includeDate) {
    const date = formatDateLabel(settings.date, locale)
    if (date) segments.push(date)
  }

  return segments.map((segment) => segment.toLocaleUpperCase(locale)).join('  •  ')
}

export function extensionForFormat(format: ExportFormat) {
  if (format === 'image/png') return 'png'
  if (format === 'image/webp') return 'webp'
  return 'jpg'
}

export function safeFileStem(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '')
  const normalized = withoutExtension
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'watermarked-id'
}

