import { useEffect, useRef, useState } from 'react'
import { Crop, Move } from 'lucide-react'
import type { CropSettings, ImageAsset, WatermarkSettings } from '../types'
import { renderWatermarkedCanvas } from '../lib/canvas'
import {
  clamp,
  ID_CARD_HEIGHT_MM,
  ID_CARD_WIDTH_MM,
  scaleCropZoom,
} from '../lib/watermark'
import type { Translate } from '../i18n'

interface PreviewCanvasProps {
  asset: ImageAsset
  crop: CropSettings
  watermark: WatermarkSettings
  onCropChange: (crop: CropSettings) => void
  t: Translate
}

type PointerPoint = { x: number; y: number }

function pointerDistance(a: PointerPoint, b: PointerPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function PreviewCanvas({
  asset,
  crop,
  watermark,
  onCropChange,
  t,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cropRef = useRef(crop)
  const pointersRef = useRef(new Map<number, PointerPoint>())
  const dragRef = useRef<PointerPoint | null>(null)
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null)
  const [rendering, setRendering] = useState(true)

  cropRef.current = crop

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

  function moveCrop(current: CropSettings, deltaX: number, deltaY: number) {
    const canvas = canvasRef.current
    if (!canvas || !current.enabled) return current

    return {
      ...current,
      focusX: clamp(current.focusX - deltaX / canvas.clientWidth, 0, 1),
      focusY: clamp(current.focusY - deltaY / canvas.clientHeight, 0, 1),
    }
  }

  function beginGesture() {
    const points = [...pointersRef.current.values()]
    if (points.length >= 2) {
      if (!cropRef.current.enabled) {
        const next = { ...cropRef.current, enabled: true }
        cropRef.current = next
        onCropChange(next)
      }
      dragRef.current = null
      pinchRef.current = {
        distance: pointerDistance(points[0], points[1]),
        zoom: cropRef.current.zoom,
      }
      return
    }
    pinchRef.current = null
    dragRef.current = cropRef.current.enabled ? points[0] ?? null : null
  }

  return (
    <div className={`preview-frame ${crop.enabled ? 'is-cropping' : ''}`}>
      <canvas
        ref={canvasRef}
        className={rendering ? 'is-rendering' : ''}
        aria-label={crop.enabled ? t('previewCrop') : t('preview')}
        tabIndex={crop.enabled ? 0 : -1}
        onPointerDown={(event) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
          pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
          beginGesture()
        }}
        onPointerMove={(event) => {
          if (!pointersRef.current.has(event.pointerId)) return
          pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

          const pinch = pinchRef.current
          if (pinch && pointersRef.current.size >= 2) {
            const [first, second] = pointersRef.current.values()
            const distance = pointerDistance(first, second)
            if (pinch.distance < 1) return
            onCropChange({
              ...cropRef.current,
              zoom: scaleCropZoom(pinch.zoom, distance / pinch.distance),
            })
            return
          }

          if (!dragRef.current || pointersRef.current.size !== 1) return
          const next = moveCrop(
            cropRef.current,
            event.clientX - dragRef.current.x,
            event.clientY - dragRef.current.y,
          )
          dragRef.current = { x: event.clientX, y: event.clientY }
          onCropChange(next)
        }}
        onPointerUp={(event) => {
          pointersRef.current.delete(event.pointerId)
          beginGesture()
        }}
        onPointerCancel={(event) => {
          pointersRef.current.delete(event.pointerId)
          beginGesture()
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
            onCropChange(moveCrop(cropRef.current, ...delta))
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
