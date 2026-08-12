import { useRef, useState } from 'react'
import { Camera, ImagePlus, LockKeyhole, Upload } from 'lucide-react'
import type { Translate } from '../i18n'

interface DropZoneProps {
  onFiles: (files: File[]) => void
  t: Translate
}

export function DropZone({ onFiles, t }: DropZoneProps) {
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    const selectedFiles = Array.from(files ?? [])
    if (selectedFiles.length) onFiles(selectedFiles)
  }

  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="welcome-copy">
        <div className="eyebrow">
          <LockKeyhole size={15} strokeWidth={2.2} />
          {t('privateByDesign')}
        </div>
        <h1 id="welcome-title">
          {t('heroLead')}
          <br />
          <span>{t('heroAccent')}</span>
        </h1>
        <p>
          {t('heroDescription')}
        </p>
      </div>

      <div
        className={`drop-zone ${dragging ? 'is-dragging' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
      >
        <div className="upload-icon" aria-hidden="true">
          <ImagePlus size={27} />
        </div>
        <h2>{t('addPhotos')}</h2>
        <p>{t('addPhotosDescription')}</p>
        <div className="upload-actions">
          <button className="button button-primary" onClick={() => fileInput.current?.click()}>
            <Upload size={18} />
            {t('choosePhoto')}
          </button>
          <button className="button button-secondary" onClick={() => cameraInput.current?.click()}>
            <Camera size={18} />
            {t('takePhoto')}
          </button>
        </div>
        <p className="file-hint">{t('fileHint')}</p>
        <input
            ref={fileInput}
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
        <input
          ref={cameraInput}
          className="visually-hidden"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      <div className="privacy-row" aria-label={t('privacyDetails')}>
        <span><LockKeyhole size={15} /> {t('noUploads')}</span>
        <span className="privacy-divider" />
        <span>{t('worksOffline')}</span>
        <span className="privacy-divider" />
        <span>{t('noTracking')}</span>
      </div>
    </section>
  )
}
