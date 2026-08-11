import { useEffect, useMemo, useRef, useState } from 'react'
import { zip } from 'fflate'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Images,
  LockKeyhole,
  Plus,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { DropZone } from './components/DropZone'
import { EditorControls } from './components/EditorControls'
import { PreviewCanvas } from './components/PreviewCanvas'
import { canvasToBlob, renderWatermarkedCanvas } from './lib/canvas'
import {
  applyPreset,
  createPreset,
  loadPreset,
  presetsMatch,
  savePreset,
  type StoredPreset,
} from './lib/preset'
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
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

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

function getInitialEditorState() {
  const fallback = {
    crop: initialCrop,
    watermark: { ...initialWatermark, date: localDateValue() },
    exportSettings: initialExport,
    savedPreset: null as StoredPreset | null,
  }

  if (typeof window === 'undefined') return fallback
  const savedPreset = loadPreset(window.localStorage)
  if (!savedPreset) return fallback

  return {
    ...applyPreset(savedPreset, localDateValue()),
    savedPreset,
  }
}

export default function App() {
  const initialState = useMemo(getInitialEditorState, [])
  const [assets, setAssets] = useState<ImageAsset[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [crop, setCrop] = useState(initialState.crop)
  const [watermark, setWatermark] = useState(initialState.watermark)
  const [exportSettings, setExportSettings] = useState(initialState.exportSettings)
  const [savedPreset, setSavedPreset] = useState<StoredPreset | null>(initialState.savedPreset)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const addInput = useRef<HTMLInputElement>(null)
  const assetsRef = useRef<ImageAsset[]>([])
  const asset = assets[activeIndex] ?? null

  useEffect(() => {
    assetsRef.current = assets
  }, [assets])

  useEffect(() => {
    return () => {
      assetsRef.current.forEach((item) => URL.revokeObjectURL(item.objectUrl))
    }
  }, [])

  const outputSize = useMemo(() => {
    if (!asset) return null
    return getOutputSize(getCropRect(asset.width, asset.height, crop))
  }, [asset, crop])

  const currentPreset = useMemo(
    () => createPreset(watermark, crop, exportSettings),
    [watermark, crop.enabled, crop.zoom, exportSettings],
  )
  const presetStatus = savedPreset
    ? presetsMatch(savedPreset, currentPreset) ? 'saved' : 'changed'
    : 'none'
  const canShare = assets.length === 1 && typeof navigator.share === 'function'

  async function decodeFile(file: File) {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.decoding = 'async'

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () => reject(new Error(`${file.name} could not be read.`))
        image.src = objectUrl
      })

      return {
        element: image,
        fileName: file.name,
        fileSize: file.size,
        width: image.naturalWidth,
        height: image.naturalHeight,
        objectUrl,
      } satisfies ImageAsset
    } catch (decodeError) {
      URL.revokeObjectURL(objectUrl)
      throw decodeError
    }
  }

  async function loadFiles(files: File[]) {
    setError('')
    setNotice('')

    const supported = files.filter(
      (file) => SUPPORTED_IMAGE_TYPES.has(file.type) && file.size <= MAX_FILE_SIZE,
    )
    const initiallySkipped = files.length - supported.length

    if (!supported.length) {
      setError(
        files.some((file) => file.size > MAX_FILE_SIZE)
          ? 'Each image must be 40 MB or smaller.'
          : 'Choose JPEG, PNG or WebP images.',
      )
      return
    }

    setImporting(true)
    try {
      const results = await Promise.allSettled(supported.map(decodeFile))
      const decoded = results
        .filter((result): result is PromiseFulfilledResult<ImageAsset> => result.status === 'fulfilled')
        .map((result) => result.value)
      const skipped = initiallySkipped + results.filter((result) => result.status === 'rejected').length

      if (!decoded.length) {
        setError('The selected images could not be read.')
        return
      }

      const firstNewIndex = assets.length
      setAssets((current) => [...current, ...decoded])
      setActiveIndex(firstNewIndex)
      if (skipped) {
        setError(`${skipped} unsupported or oversized ${skipped === 1 ? 'file was' : 'files were'} skipped.`)
      } else if (decoded.length > 1) {
        setNotice(`${decoded.length} images added. Your current settings apply to the whole batch.`)
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'One of the images could not be read.')
    } finally {
      setImporting(false)
    }
  }

  function removeActiveAsset() {
    if (!asset) return
    URL.revokeObjectURL(asset.objectUrl)
    const nextAssets = assets.filter((_, index) => index !== activeIndex)
    setAssets(nextAssets)
    setActiveIndex(Math.max(0, Math.min(activeIndex, nextAssets.length - 1)))
    setError('')
    setNotice('')
  }

  function saveCurrentPreset() {
    try {
      savePreset(window.localStorage, currentPreset)
      setSavedPreset(currentPreset)
      setNotice('Default preset saved on this device.')
      setError('')
    } catch {
      setError('This browser could not save the preset.')
    }
  }

  function restoreSavedPreset() {
    if (!savedPreset) return
    const applied = applyPreset(savedPreset, localDateValue())
    setWatermark(applied.watermark)
    setCrop(applied.crop)
    setExportSettings(applied.exportSettings)
    setNotice('Default preset restored.')
    setError('')
  }

  async function createExport(target: ImageAsset) {
    if (!watermark.company.trim()) {
      throw new Error('Enter the target company before exporting your ID.')
    }

    const canvas = renderWatermarkedCanvas({
      image: target.element,
      crop,
      watermark,
    })
    const blob = await canvasToBlob(
      canvas,
      exportSettings.format,
      exportSettings.quality / 100,
    )
    const extension = extensionForFormat(exportSettings.format)
    const filename = `${safeFileStem(target.fileName)}-watermarked.${extension}`
    return { blob, filename }
  }

  async function handleDownload() {
    if (!assets.length) return
    setExporting(true)
    setError('')
    setNotice('')
    try {
      if (assets.length === 1) {
        const { blob, filename } = await createExport(assets[0])
        downloadBlob(blob, filename)
        setNotice('Saved to your device.')
      } else {
        const entries: Record<string, Uint8Array> = {}
        for (const [index, target] of assets.entries()) {
          const { blob, filename } = await createExport(target)
          const prefix = String(index + 1).padStart(2, '0')
          entries[`${prefix}-${filename}`] = new Uint8Array(await blob.arrayBuffer())
        }
        const archive = await createZip(entries)
        const archiveBlob = new Blob([archive.buffer as ArrayBuffer], { type: 'application/zip' })
        downloadBlob(archiveBlob, `watermarked-ids-${localDateValue()}.zip`)
        setNotice(`${assets.length} watermarked IDs saved in one ZIP.`)
      }
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'The images could not be exported.')
    } finally {
      setExporting(false)
    }
  }

  async function handleShare() {
    if (!asset) return
    setExporting(true)
    setError('')
    setNotice('')
    try {
      const { blob, filename } = await createExport(asset)
      const file = new File([blob], filename, { type: blob.type })
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        throw new Error('File sharing is not available here. Download the image instead.')
      }
      await navigator.share({ files: [file], title: 'Watermarked ID' })
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
          <DropZone onFiles={loadFiles} />
        ) : (
          <main className="editor">
            <section className="preview-column" aria-label="Document preview">
              <div className="file-toolbar">
                <div className="file-summary">
                  <span className="file-icon"><FileImage size={17} /></span>
                  <span className="file-copy">
                    <strong>{asset.fileName}</strong>
                    <small>{formatBytes(asset.fileSize)} · {asset.width} × {asset.height} px</small>
                  </span>
                  {assets.length > 1 && <span className="batch-badge"><Images size={12} /> Batch</span>}
                </div>
                <div className="toolbar-actions">
                  {assets.length > 1 && (
                    <div className="batch-nav" aria-label="Batch image navigation">
                      <button
                        type="button"
                        aria-label="Previous image"
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
                      ><ChevronLeft size={15} /></button>
                      <span>{activeIndex + 1} of {assets.length}</span>
                      <button
                        type="button"
                        aria-label="Next image"
                        disabled={activeIndex === assets.length - 1}
                        onClick={() => setActiveIndex((index) => Math.min(assets.length - 1, index + 1))}
                      ><ChevronRight size={15} /></button>
                    </div>
                  )}
                  <button className="icon-label-button" type="button" disabled={importing} onClick={() => addInput.current?.click()}>
                    <Plus size={16} /> {importing ? 'Adding…' : 'Add'}
                  </button>
                  <button className="icon-button danger-hover" type="button" onClick={removeActiveAsset} aria-label="Remove current image">
                    <Trash2 size={17} />
                  </button>
                </div>
                <input
                  ref={addInput}
                  className="visually-hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? [])
                    if (files.length) loadFiles(files)
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
              presetStatus={presetStatus}
              onCropChange={setCrop}
              onWatermarkChange={setWatermark}
              onExportChange={setExportSettings}
              onSavePreset={saveCurrentPreset}
              onRestorePreset={restoreSavedPreset}
            />
          </main>
        )}
      </div>

      {asset && (
        <footer className="export-bar">
          <div className="export-inner">
            <div className="privacy-note">
              <span className="privacy-icon"><ShieldCheck size={19} /></span>
              <span>
                <strong>{assets.length > 1 ? `${assets.length} IDs · one private batch` : 'Your ID stays private'}</strong>
                <small>Processed entirely in this browser</small>
              </span>
            </div>
            <div className="export-actions">
              {canShare && (
                <button className="button button-secondary share-button" type="button" disabled={exporting} onClick={handleShare}>
                  <Share2 size={18} /> Share
                </button>
              )}
              <button className="button button-primary download-button" type="button" disabled={exporting} onClick={handleDownload}>
                {exporting ? <span className="spinner" /> : <Download size={19} />}
                {exporting
                  ? assets.length > 1 ? `Preparing ${assets.length}…` : 'Preparing…'
                  : assets.length > 1 ? `Download batch (${assets.length})` : 'Download watermarked ID'}
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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function createZip(entries: Record<string, Uint8Array>) {
  return new Promise<Uint8Array>((resolve, reject) => {
    zip(entries, { level: 0 }, (zipError, data) => {
      if (zipError) reject(zipError)
      else resolve(data)
    })
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
