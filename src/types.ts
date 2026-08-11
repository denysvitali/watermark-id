export type WatermarkPattern = 'diagonal' | 'horizontal' | 'focus'
export type ExportFormat = 'image/jpeg' | 'image/png' | 'image/webp'

export interface CropSettings {
  enabled: boolean
  zoom: number
  focusX: number
  focusY: number
}

export interface WatermarkSettings {
  company: string
  purpose: string
  includeDate: boolean
  date: string
  color: string
  opacity: number
  fontSize: number
  spacing: number
  angle: number
  pattern: WatermarkPattern
}

export interface ExportSettings {
  format: ExportFormat
  quality: number
}

export interface ImageAsset {
  element: HTMLImageElement
  fileName: string
  fileSize: number
  width: number
  height: number
  objectUrl: string
}

export interface SourceRect {
  x: number
  y: number
  width: number
  height: number
}

