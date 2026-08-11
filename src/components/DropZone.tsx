import { useRef, useState } from 'react'
import { Camera, ImagePlus, LockKeyhole, Upload } from 'lucide-react'

interface DropZoneProps {
  onFiles: (files: File[]) => void
}

export function DropZone({ onFiles }: DropZoneProps) {
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
          Private by design
        </div>
        <h1 id="welcome-title">
          Share your ID.
          <br />
          <span>Keep control.</span>
        </h1>
        <p>
          Crop and watermark sensitive documents without sending them anywhere.
          Everything happens on this device.
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
        <h2>Add your ID photos</h2>
        <p>Choose one image, or select several to process as a batch.</p>
        <div className="upload-actions">
          <button className="button button-primary" onClick={() => fileInput.current?.click()}>
            <Upload size={18} />
            Choose photo
          </button>
          <button className="button button-secondary" onClick={() => cameraInput.current?.click()}>
            <Camera size={18} />
            Take photo
          </button>
        </div>
        <p className="file-hint">JPEG, PNG or WebP · up to 40 MB</p>
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

      <div className="privacy-row" aria-label="Privacy details">
        <span><LockKeyhole size={15} /> No uploads</span>
        <span className="privacy-divider" />
        <span>Works offline</span>
        <span className="privacy-divider" />
        <span>No tracking</span>
      </div>
    </section>
  )
}
