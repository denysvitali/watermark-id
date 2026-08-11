import type { CropSettings, WatermarkSettings } from '../types'
import { getCropRect, getOutputSize, getWatermarkText } from './watermark'

interface RenderOptions {
  image: HTMLImageElement
  crop: CropSettings
  watermark: WatermarkSettings
  maxEdge?: number
  pixelRatio?: number
}

export function renderWatermarkedCanvas({
  image,
  crop,
  watermark,
  maxEdge,
  pixelRatio = 1,
}: RenderOptions) {
  const rect = getCropRect(image.naturalWidth, image.naturalHeight, crop)
  const output = getOutputSize(rect, maxEdge)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(output.width * pixelRatio))
  canvas.height = Math.max(1, Math.round(output.height * pixelRatio))

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas rendering is not supported in this browser.')

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  drawWatermark(context, canvas.width, canvas.height, watermark)
  return canvas
}

function drawWatermark(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: WatermarkSettings,
) {
  const text = getWatermarkText(settings)
  const shortestEdge = Math.min(width, height)
  const fontSize = Math.max(13, shortestEdge * (settings.fontSize / 100))

  context.save()
  context.fillStyle = settings.color
  context.globalAlpha = settings.opacity / 100
  context.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, Arial, sans-serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  if (settings.pattern === 'focus') {
    drawFocusWatermark(context, width, height, text, fontSize)
  } else {
    drawRepeatedWatermark(context, width, height, text, fontSize, settings)
  }

  context.restore()
}

function drawFocusWatermark(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  fontSize: number,
) {
  const maxTextWidth = width * 0.78
  const measuredWidth = context.measureText(text).width
  if (measuredWidth > maxTextWidth) {
    context.font = context.font.replace(
      `${fontSize}px`,
      `${Math.max(12, fontSize * (maxTextWidth / measuredWidth))}px`,
    )
  }

  const paddingX = fontSize * 0.85
  const boxWidth = Math.min(width * 0.9, context.measureText(text).width + paddingX * 2)
  const boxHeight = fontSize * 2.4
  const x = (width - boxWidth) / 2
  const y = (height - boxHeight) / 2

  context.save()
  context.globalAlpha *= 0.9
  roundRect(context, x, y, boxWidth, boxHeight, boxHeight / 2)
  context.fill()
  context.globalCompositeOperation = 'destination-out'
  context.globalAlpha = 0.88
  context.fillText(text, width / 2, height / 2)
  context.restore()
}

function drawRepeatedWatermark(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  fontSize: number,
  settings: WatermarkSettings,
) {
  const angle = settings.pattern === 'horizontal' ? 0 : settings.angle
  const radians = (angle * Math.PI) / 180
  const diagonal = Math.hypot(width, height)
  const textWidth = context.measureText(text).width
  const gap = Math.max(fontSize * 1.5, (settings.spacing / 100) * Math.min(width, height))
  const stepX = textWidth + gap
  const stepY = fontSize * 1.25 + gap * 0.58

  context.translate(width / 2, height / 2)
  context.rotate(radians)

  let row = 0
  for (let y = -diagonal; y <= diagonal; y += stepY) {
    const offset = row % 2 === 0 ? 0 : stepX / 2
    for (let x = -diagonal - offset; x <= diagonal; x += stepX) {
      context.fillText(text, x + offset, y)
    }
    row += 1
  }
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const boundedRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + boundedRadius, y)
  context.arcTo(x + width, y, x + width, y + height, boundedRadius)
  context.arcTo(x + width, y + height, x, y + height, boundedRadius)
  context.arcTo(x, y + height, x, y, boundedRadius)
  context.arcTo(x, y, x + width, y, boundedRadius)
  context.closePath()
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('This browser could not create the image.'))
      },
      type,
      quality,
    )
  })
}

