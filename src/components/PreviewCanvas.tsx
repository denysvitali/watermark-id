import { useEffect, useRef, useState } from 'react'
import { Crop, Move } from 'lucide-react'
import type { CropSettings, ImageAsset, WatermarkSettings } from '../types'
import { renderWatermarkedCanvas } from '../lib/canvas'
import { clamp, ID_CARD_HEIGHT_MM, ID_CARD_WIDTH_MM } from '../lib/watermark'
import type { Translate } from '../i18n'

interface PreviewCanvasProps {
  asset: ImageAsset
  crop: CropSettings
  watermark: WatermarkSettings
  onCropChange: (crop: CropSettings) => void
  t: Translate
}

export function PreviewCanvas({
  asset,
  crop,
  watermark,
  onCropChange,
  t,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const [rendering, setRendering] = useState(true)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      setRendering(true)
      const rendered = renderWatermarkedCanvas({
        image: asset.element,
        crop,
        watermark,
        maxEdge: 1400,
      })
      canvas.width = rendered.width
      canvas.height = rendered.height
      const context = canvas.getContext('2d')
      context?.drawImage(rendered, 0, 0)
      setRendering(false)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [asset, crop, watermark])

  function moveCrop(deltaX: number, deltaY: number) {
    const canvas = canvasRef.current
    if (!canvas || !crop.enabled) return

    onCropChange({
      ...crop,
      focusX: clamp(crop.focusX - deltaX / canvas.clientWidth, 0, 1),
      focusY: clamp(crop.focusY - deltaY / canvas.clientHeight, 0, 1),
    })
  }

  return (
    <div className={`preview-frame ${crop.enabled ? 'is-cropping' : ''}`}>
      <canvas
        ref={canvasRef}
        className={rendering ? 'is-rendering' : ''}
        aria-label={crop.enabled ? t('previewCrop') : t('preview')}
        tabIndex={crop.enabled ? 0 : -1}
        onPointerDown={(event) => {
          if (!crop.enabled) return
          event.currentTarget.setPointerCapture(event.pointerId)
          pointerRef.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerMove={(event) => {
          if (!pointerRef.current || !crop.enabled) return
          moveCrop(event.clientX - pointerRef.current.x, event.clientY - pointerRef.current.y)
          pointerRef.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={() => {
          pointerRef.current = null
        }}
        onPointerCancel={() => {
          pointerRef.current = null
        }}
        onKeyDown={(event) => {
          const movement: Record<string, [number, number]> = {
            ArrowLeft: [12, 0],
            ArrowRight: [-12, 0],
            ArrowUp: [0, 12],
            ArrowDown: [0, -12],
          }
          const delta = movement[event.key]
          if (delta) {
            event.preventDefault()
            moveCrop(...delta)
          }
        }}
      />

      {crop.enabled && (
        <>
          <div className="crop-outline" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          <div className="crop-standard-badge">
            <Crop size={14} />
            ID-1 · {ID_CARD_WIDTH_MM.toFixed(2)} × {ID_CARD_HEIGHT_MM.toFixed(2)} mm
          </div>
          <div className="drag-hint" aria-hidden="true">
            <Move size={14} /> {t('dragToReposition')}
          </div>
        </>
      )}
    </div>
  )
}
