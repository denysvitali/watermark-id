import { useEffect, useMemo, useRef, useState } from 'react'
import { zip } from 'fflate'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  CodeXml,
  FileImage,
  Languages,
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
  defaultPurpose,
  getInitialLocale,
  isDefaultPurpose,
  LOCALE_STORAGE_KEY,
  localeNames,
  supportedLocales,
  translate,
  type Locale,
} from './i18n'
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
import { GITHUB_LICENSE, GITHUB_REPO } from './site'
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

function getInitialEditorState(locale: Locale) {
  const fallback = {
    crop: initialCrop,
    watermark: { ...initialWatermark, purpose: defaultPurpose(locale), date: localDateValue() },
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
  const [locale, setLocale] = useState(getInitialLocale)
  const t = useMemo(() => translate(locale), [locale])
  const initialState = useMemo(() => getInitialEditorState(locale), [])
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
    document.documentElement.lang = locale
    document.title = t('pageTitle')
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', t('metaDescription'))
  }, [locale, t])

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
        image.onerror = () => reject(new Error(t('imageUnreadableNamed', { name: file.name })))
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
          ? t('maxFileSize')
          : t('chooseSupported'),
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
        setError(t('imagesUnreadable'))
        return
      }

      const firstNewIndex = assets.length
      setAssets((current) => [...current, ...decoded])
      setActiveIndex(firstNewIndex)
      if (skipped) {
        setError(skipped === 1 ? t('skippedOne') : t('skippedMany', { count: skipped }))
      } else if (decoded.length > 1) {
        setNotice(t('batchAdded', { count: decoded.length }))
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('oneImageUnreadable'))
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
      setNotice(t('presetSavedNotice'))
      setError('')
    } catch {
      setError(t('presetSaveError'))
    }
  }

  function restoreSavedPreset() {
    if (!savedPreset) return
    const applied = applyPreset(savedPreset, localDateValue())
    setWatermark(applied.watermark)
    setCrop(applied.crop)
    setExportSettings(applied.exportSettings)
    setNotice(t('presetRestoredNotice'))
    setError('')
  }

  async function createExport(target: ImageAsset) {
    if (!watermark.company.trim()) {
      throw new Error(t('enterCompany'))
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
        setNotice(t('savedNotice'))
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
        setNotice(t('batchSavedNotice', { count: assets.length }))
      }
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : t('exportError'))
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
        throw new Error(t('sharingUnavailable'))
      }
      await navigator.share({ files: [file], title: t('shareTitle') })
      setNotice(t('sharedNotice'))
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === 'AbortError') return
      setError(shareError instanceof Error ? shareError.message : t('shareError'))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label={t('home')}>
          <span className="brand-mark"><ShieldCheck size={20} /></span>
          <span>Watermark <strong>ID</strong></span>
        </a>
        <div className="header-actions">
          <a
            className="github-link"
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            aria-label={t('viewSourceAria')}
            title={t('viewSource')}
          >
            <CodeXml size={16} />
            <span>{t('viewSource')}</span>
          </a>
          <label className="language-picker">
            <Languages size={15} aria-hidden="true" />
            <span className="visually-hidden">{t('language')}</span>
            <select
              aria-label={t('language')}
              value={locale}
              onChange={(event) => {
                const nextLocale = event.target.value as Locale
                try { window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale) } catch { /* optional preference */ }
                setWatermark((current) => isDefaultPurpose(current.purpose)
                  ? { ...current, purpose: defaultPurpose(nextLocale) }
                  : current)
                setLocale(nextLocale)
                setError('')
                setNotice('')
              }}
            >
              {supportedLocales.map((language) => (
                <option value={language} key={language}>{localeNames[language]}</option>
              ))}
            </select>
          </label>
          <div className="local-badge" title={t('imagesStayLocal')}>
            <span className="status-dot" />
            <LockKeyhole size={14} />
            {t('onDeviceOnly')}
          </div>
        </div>
      </header>

      <div className="app-content">
        {!asset ? (
          <DropZone onFiles={loadFiles} t={t} />
        ) : (
          <main className="editor">
            <section className="preview-column" aria-label={t('documentPreview')}>
              <div className="file-toolbar">
                <div className="file-summary">
                  <span className="file-icon"><FileImage size={17} /></span>
                  <span className="file-copy">
                    <strong>{asset.fileName}</strong>
                    <small>{formatBytes(asset.fileSize, locale)} · {asset.width.toLocaleString(locale)} × {asset.height.toLocaleString(locale)} px</small>
                  </span>
                  {assets.length > 1 && <span className="batch-badge"><Images size={12} /> {t('batch')}</span>}
                </div>
                <div className="toolbar-actions">
                  {assets.length > 1 && (
                    <div className="batch-nav" aria-label={t('batchNavigation')}>
                      <button
                        type="button"
                        aria-label={t('previousImage')}
                        disabled={activeIndex === 0}
                        onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
                      ><ChevronLeft size={15} /></button>
                      <span>{t('positionOfTotal', { position: activeIndex + 1, total: assets.length })}</span>
                      <button
                        type="button"
                        aria-label={t('nextImage')}
                        disabled={activeIndex === assets.length - 1}
                        onClick={() => setActiveIndex((index) => Math.min(assets.length - 1, index + 1))}
                      ><ChevronRight size={15} /></button>
                    </div>
                  )}
                  <button className="icon-label-button" type="button" disabled={importing} onClick={() => addInput.current?.click()}>
                    <Plus size={16} /> {importing ? t('adding') : t('add')}
                  </button>
                  <button className="icon-button danger-hover" type="button" onClick={removeActiveAsset} aria-label={t('removeImage')}>
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
                  t={t}
                />
              </div>

              <div className="preview-footnote">
                <span><ShieldCheck size={15} /> {t('renderedLocally')}</span>
                <span>{outputSize?.width.toLocaleString(locale)} × {outputSize?.height.toLocaleString(locale)} px</span>
              </div>
            </section>

            <EditorControls
              crop={crop}
              watermark={watermark}
              exportSettings={exportSettings}
              outputLabel={outputSize ? `${outputSize.width.toLocaleString(locale)} × ${outputSize.height.toLocaleString(locale)} px` : '—'}
              presetStatus={presetStatus}
              onCropChange={setCrop}
              onWatermarkChange={setWatermark}
              onExportChange={setExportSettings}
              onSavePreset={saveCurrentPreset}
              onRestorePreset={restoreSavedPreset}
              t={t}
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
                <strong>{assets.length > 1 ? t('idsPrivateBatch', { count: assets.length }) : t('idStaysPrivate')}</strong>
                <small>{t('processedInBrowser')}</small>
              </span>
            </div>
            <div className="export-actions">
              {canShare && (
                <button className="button button-secondary share-button" type="button" disabled={exporting} onClick={handleShare}>
                  <Share2 size={18} /> {t('share')}
                </button>
              )}
              <button className="button button-primary download-button" type="button" disabled={exporting} onClick={handleDownload}>
                {exporting ? <span className="spinner" /> : <Download size={19} />}
                {exporting
                  ? assets.length > 1 ? t('preparingCount', { count: assets.length }) : t('preparing')
                  : assets.length > 1 ? t('downloadBatch', { count: assets.length }) : t('downloadId')}
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
          <button type="button" onClick={() => { setError(''); setNotice('') }} aria-label={t('dismiss')}>
            <X size={15} />
          </button>
        </div>
      )}

      {!asset && (
        <footer className="site-footer">
          <span>Watermark ID</span>
          <span className="footer-dot">·</span>
          <span>{t('privateOfflineYours')}</span>
          <span className="footer-dot">·</span>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer">{t('viewSource')}</a>
          <span className="footer-dot">·</span>
          <a href={GITHUB_LICENSE} target="_blank" rel="noreferrer">{t('mitLicense')}</a>
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

function formatBytes(bytes: number, locale: Locale) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString(locale)} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} MB`
}
