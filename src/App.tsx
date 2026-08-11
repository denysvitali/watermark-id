import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  Download,
  FileImage,
  LockKeyhole,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { DropZone } from './components/DropZone'
import { EditorControls } from './components/EditorControls'
import { PreviewCanvas } from './components/PreviewCanvas'
import { canvasToBlob, renderWatermarkedCanvas } from './lib/canvas'
import {
  extensionForFormat,
  getCropRect,
  getOutputSize,
  safeFileStem,
} from './lib/watermark'
import type {
  CropSettings,
  ExportSettings,
  ImageAsset,
  WatermarkSettings,
} from './types'

const MAX_FILE_SIZE = 40 * 1024 * 1024

function localDateValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initialCrop: CropSettings = {
  enabled: false,
  zoom: 1,
  focusX: 0.5,
  focusY: 0.5,
}

const initialWatermark: WatermarkSettings = {
  company: '',
  purpose: 'Identity verification',
  includeDate: true,
  date: localDateValue(),
  color: '#ffffff',
  opacity: 34,
  fontSize: 4.5,
  spacing: 24,
  angle: -28,
  pattern: 'diagonal',
}

const initialExport: ExportSettings = {
  format: 'image/jpeg',
  quality: 92,
}

export default function App() {
  const [asset, setAsset] = useState<ImageAsset | null>(null)
  const [crop, setCrop] = useState(initialCrop)
  const [watermark, setWatermark] = useState(initialWatermark)
  const [exportSettings, setExportSettings] = useState(initialExport)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [exporting, setExporting] = useState(false)
  const replaceInput = useRef<HTMLInputElement>(null)
  const assetRef = useRef<ImageAsset | null>(null)

  useEffect(() => {
    assetRef.current = asset
  }, [asset])

  useEffect(() => {
    return () => {
      if (assetRef.current) URL.revokeObjectURL(assetRef.current.objectUrl)
    }
  }, [])

  const outputSize = useMemo(() => {
    if (!asset) return null
    return getOutputSize(getCropRect(asset.width, asset.height, crop))
  }, [asset, crop])

  const canShare = typeof navigator.share === 'function'

  async function loadFile(file: File) {
    setError('')
    setNotice('')

    if (!file.type.startsWith('image/')) {
      setError('Choose a JPEG, PNG or WebP image.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('That image is larger than 40 MB. Choose a smaller photo.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.decoding = 'async'

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error('The image could not be read. Try a JPEG, PNG or WebP file.'))
        image.src = objectUrl
      })

      if (asset) URL.revokeObjectURL(asset.objectUrl)
      setAsset({
        element: image,
        fileName: file.name,
        fileSize: file.size,
        width: image.naturalWidth,
        height: image.naturalHeight,
        objectUrl,
      })
      setCrop(initialCrop)
    } catch (loadError) {
      URL.revokeObjectURL(objectUrl)
      setError(loadError instanceof Error ? loadError.message : 'The image could not be read.')
    }
  }

  function clearAsset() {
    if (asset) URL.revokeObjectURL(asset.objectUrl)
    setAsset(null)
    setCrop(initialCrop)
    setError('')
    setNotice('')
  }

  async function createExport() {
    if (!asset) throw new Error('Add an image first.')
    if (!watermark.company.trim()) {
      throw new Error('Enter the target company before exporting your ID.')
    }

    const canvas = renderWatermarkedCanvas({
      image: asset.element,
      crop,
      watermark,
    })
    const blob = await canvasToBlob(
      canvas,
      exportSettings.format,
      exportSettings.quality / 100,
    )
    const extension = extensionForFormat(exportSettings.format)
    const filename = `${safeFileStem(asset.fileName)}-watermarked.${extension}`
    return { blob, filename }
  }

  async function handleDownload() {
    setExporting(true)
    setError('')
    setNotice('')
    try {
      const { blob, filename } = await createExport()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setNotice('Saved to your device.')
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'The image could not be exported.')
    } finally {
      setExporting(false)
    }
  }

  async function handleShare() {
    setExporting(true)
    setError('')
    setNotice('')
    try {
      const { blob, filename } = await createExport()
      const file = new File([blob], filename, { type: blob.type })
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        throw new Error('File sharing is not available here. Download the image instead.')
      }
      await navigator.share({
        files: [file],
        title: 'Watermarked ID',
      })
      setNotice('Shared securely from your device.')
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return
      setError(shareError instanceof Error ? shareError.message : 'The image could not be shared.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Watermark ID home">
          <span className="brand-mark"><ShieldCheck size={20} /></span>
          <span>Watermark <strong>ID</strong></span>
        </a>
        <div className="local-badge" title="Images never leave this device">
          <span className="status-dot" />
          <LockKeyhole size={14} />
          On-device only
        </div>
      </header>

      <div className="app-content">
        {!asset ? (
          <DropZone onFile={loadFile} />
        ) : (
          <main className="editor">
            <section className="preview-column" aria-label="Document preview">
              <div className="file-toolbar">
                <div className="file-summary">
                  <span className="file-icon"><FileImage size={17} /></span>
                  <span>
                    <strong>{asset.fileName}</strong>
                    <small>{formatBytes(asset.fileSize)} · {asset.width} × {asset.height} px</small>
                  </span>
                </div>
                <div className="toolbar-actions">
                  <button className="icon-label-button" type="button" onClick={() => replaceInput.current?.click()}>
                    <Upload size={16} /> Replace
                  </button>
                  <button className="icon-button danger-hover" type="button" onClick={clearAsset} aria-label="Remove image">
                    <Trash2 size={17} />
                  </button>
                </div>
                <input
                  ref={replaceInput}
                  className="visually-hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) loadFile(file)
                    event.target.value = ''
                  }}
                />
              </div>

              <div className="canvas-stage">
                <div className="ambient-glow" aria-hidden="true" />
                <PreviewCanvas
                  asset={asset}
                  crop={crop}
                  watermark={watermark}
                  onCropChange={setCrop}
                />
              </div>

              <div className="preview-footnote">
                <span><ShieldCheck size={15} /> Preview rendered locally</span>
                <span>{outputSize?.width.toLocaleString()} × {outputSize?.height.toLocaleString()} px</span>
              </div>
            </section>

            <EditorControls
              crop={crop}
              watermark={watermark}
              exportSettings={exportSettings}
              outputLabel={outputSize ? `${outputSize.width.toLocaleString()} × ${outputSize.height.toLocaleString()} px` : '—'}
              onCropChange={setCrop}
              onWatermarkChange={setWatermark}
              onExportChange={setExportSettings}
            />
          </main>
        )}
      </div>

      {asset && (
        <footer className="export-bar">
          <div className="export-inner">
            <div className="privacy-note">
              <span className="privacy-icon"><ShieldCheck size={19} /></span>
              <span><strong>Your ID stays private</strong><small>Processed entirely in this browser</small></span>
            </div>
            <div className="export-actions">
              {canShare && (
                <button className="button button-secondary share-button" type="button" disabled={exporting} onClick={handleShare}>
                  <Share2 size={18} /> Share
                </button>
              )}
              <button className="button button-primary download-button" type="button" disabled={exporting} onClick={handleDownload}>
                {exporting ? <span className="spinner" /> : <Download size={19} />}
                {exporting ? 'Preparing…' : 'Download watermarked ID'}
                {!exporting && <Sparkles className="button-sparkle" size={14} />}
              </button>
            </div>
          </div>
        </footer>
      )}

      {(error || notice) && (
        <div className={`toast ${error ? 'toast-error' : 'toast-success'}`} role={error ? 'alert' : 'status'}>
          <span>{error ? <X size={17} /> : <Check size={17} />}</span>
          {error || notice}
          <button type="button" onClick={() => { setError(''); setNotice('') }} aria-label="Dismiss message">
            <X size={15} />
          </button>
        </div>
      )}

      {!asset && (
        <footer className="site-footer">
          <span>Watermark ID</span>
          <span className="footer-dot">·</span>
          <span>Private. Offline. Yours.</span>
        </footer>
      )}
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
