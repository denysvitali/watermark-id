import {
  CalendarDays,
  Check,
  Crop,
  Grid3X3,
  Minus,
  Palette,
  RotateCcw,
  Rows3,
  Scan,
  SlidersHorizontal,
  Type,
} from 'lucide-react'
import type {
  CropSettings,
  ExportSettings,
  WatermarkPattern,
  WatermarkSettings,
} from '../types'

interface EditorControlsProps {
  crop: CropSettings
  watermark: WatermarkSettings
  exportSettings: ExportSettings
  outputLabel: string
  onCropChange: (settings: CropSettings) => void
  onWatermarkChange: (settings: WatermarkSettings) => void
  onExportChange: (settings: ExportSettings) => void
}

const colorPresets = ['#ffffff', '#111111', '#ff3b30', '#007aff', '#ffcc00']

export function EditorControls({
  crop,
  watermark,
  exportSettings,
  outputLabel,
  onCropChange,
  onWatermarkChange,
  onExportChange,
}: EditorControlsProps) {
  const updateWatermark = (patch: Partial<WatermarkSettings>) =>
    onWatermarkChange({ ...watermark, ...patch })

  return (
    <aside className="control-panel" aria-label="Watermark settings">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Customize</span>
          <h2>Watermark</h2>
        </div>
        <SlidersHorizontal size={20} aria-hidden="true" />
      </div>

      <section className="control-section" aria-labelledby="details-heading">
        <div className="section-heading">
          <Type size={17} />
          <h3 id="details-heading">Details</h3>
        </div>
        <label className="field">
          <span>Target company</span>
          <input
            value={watermark.company}
            onChange={(event) => updateWatermark({ company: event.target.value })}
            placeholder="e.g. Northstar Bank"
            autoComplete="organization"
            maxLength={60}
          />
        </label>
        <label className="field">
          <span>Purpose</span>
          <input
            value={watermark.purpose}
            onChange={(event) => updateWatermark({ purpose: event.target.value })}
            placeholder="Identity verification"
            maxLength={60}
          />
        </label>
        <div className="date-row">
          <label className="field date-field">
            <span>Date</span>
            <div className="input-with-icon">
              <CalendarDays size={16} />
              <input
                type="date"
                value={watermark.date}
                disabled={!watermark.includeDate}
                onChange={(event) => updateWatermark({ date: event.target.value })}
              />
            </div>
          </label>
          <label className="toggle-wrap">
            <span className="visually-hidden">Include date</span>
            <input
              type="checkbox"
              checked={watermark.includeDate}
              onChange={(event) => updateWatermark({ includeDate: event.target.checked })}
            />
            <span className="toggle" aria-hidden="true" />
          </label>
        </div>
      </section>

      <section className="control-section" aria-labelledby="style-heading">
        <div className="section-heading">
          <Grid3X3 size={17} />
          <h3 id="style-heading">Pattern</h3>
        </div>
        <div className="segmented pattern-selector" role="group" aria-label="Watermark pattern">
          <PatternButton
            label="Diagonal"
            icon={<Grid3X3 size={16} />}
            value="diagonal"
            selected={watermark.pattern}
            onSelect={(pattern) => updateWatermark({ pattern })}
          />
          <PatternButton
            label="Rows"
            icon={<Rows3 size={16} />}
            value="horizontal"
            selected={watermark.pattern}
            onSelect={(pattern) => updateWatermark({ pattern })}
          />
          <PatternButton
            label="Focus"
            icon={<Scan size={16} />}
            value="focus"
            selected={watermark.pattern}
            onSelect={(pattern) => updateWatermark({ pattern })}
          />
        </div>

        <RangeField
          label="Opacity"
          value={watermark.opacity}
          min={5}
          max={80}
          suffix="%"
          onChange={(opacity) => updateWatermark({ opacity })}
        />
        <RangeField
          label="Text size"
          value={watermark.fontSize}
          min={2.5}
          max={10}
          step={0.5}
          suffix="%"
          onChange={(fontSize) => updateWatermark({ fontSize })}
        />
        {watermark.pattern !== 'focus' && (
          <RangeField
            label="Spacing"
            value={watermark.spacing}
            min={8}
            max={60}
            suffix="%"
            onChange={(spacing) => updateWatermark({ spacing })}
          />
        )}
        {watermark.pattern === 'diagonal' && (
          <RangeField
            label="Angle"
            value={watermark.angle}
            min={-60}
            max={60}
            suffix="°"
            onChange={(angle) => updateWatermark({ angle })}
          />
        )}

        <div className="color-field">
          <span><Palette size={15} /> Color</span>
          <div className="color-options">
            {colorPresets.map((color) => (
              <button
                type="button"
                className={`color-swatch ${watermark.color.toLowerCase() === color ? 'is-selected' : ''}`}
                style={{ '--swatch': color } as React.CSSProperties}
                aria-label={`Use ${color} watermark`}
                aria-pressed={watermark.color.toLowerCase() === color}
                onClick={() => updateWatermark({ color })}
                key={color}
              >
                {watermark.color.toLowerCase() === color && <Check size={12} />}
              </button>
            ))}
            <label className="custom-color" title="Choose a custom color">
              <span className="visually-hidden">Custom watermark color</span>
              <input
                type="color"
                value={watermark.color}
                onChange={(event) => updateWatermark({ color: event.target.value })}
              />
              <Palette size={14} />
            </label>
          </div>
        </div>
      </section>

      <section className="control-section" aria-labelledby="crop-heading">
        <div className="section-heading section-heading-toggle">
          <div><Crop size={17} /><h3 id="crop-heading">Credit card crop</h3></div>
          <label className="toggle-wrap">
            <span className="visually-hidden">Use credit card crop</span>
            <input
              type="checkbox"
              checked={crop.enabled}
              onChange={(event) => onCropChange({ ...crop, enabled: event.target.checked })}
            />
            <span className="toggle" aria-hidden="true" />
          </label>
        </div>
        <p className="section-note">ISO/IEC 7810 ID-1 proportions · 85.60 × 53.98 mm</p>
        {crop.enabled && (
          <>
            <RangeField
              label="Zoom"
              value={crop.zoom}
              min={1}
              max={3}
              step={0.05}
              suffix="×"
              onChange={(zoom) => onCropChange({ ...crop, zoom })}
            />
            <button
              className="text-button"
              type="button"
              onClick={() => onCropChange({ enabled: true, zoom: 1, focusX: 0.5, focusY: 0.5 })}
            >
              <RotateCcw size={14} /> Reset crop
            </button>
          </>
        )}
      </section>

      <section className="control-section export-section" aria-labelledby="export-heading">
        <div className="section-heading">
          <Scan size={17} />
          <h3 id="export-heading">Export</h3>
        </div>
        <div className="segmented format-selector" role="group" aria-label="Export format">
          {([
            ['image/jpeg', 'JPG'],
            ['image/png', 'PNG'],
            ['image/webp', 'WebP'],
          ] as const).map(([format, label]) => (
            <button
              key={format}
              type="button"
              className={exportSettings.format === format ? 'is-selected' : ''}
              aria-pressed={exportSettings.format === format}
              onClick={() => onExportChange({ ...exportSettings, format })}
            >
              {label}
            </button>
          ))}
        </div>
        {exportSettings.format !== 'image/png' && (
          <RangeField
            label="Quality"
            value={exportSettings.quality}
            min={60}
            max={100}
            suffix="%"
            onChange={(quality) => onExportChange({ ...exportSettings, quality })}
          />
        )}
        <div className="output-meta">
          <span>Output</span>
          <strong>{outputLabel}</strong>
        </div>
      </section>
    </aside>
  )
}

interface PatternButtonProps {
  label: string
  icon: React.ReactNode
  value: WatermarkPattern
  selected: WatermarkPattern
  onSelect: (value: WatermarkPattern) => void
}

function PatternButton({ label, icon, value, selected, onSelect }: PatternButtonProps) {
  return (
    <button
      type="button"
      className={selected === value ? 'is-selected' : ''}
      aria-pressed={selected === value}
      onClick={() => onSelect(value)}
    >
      {icon}
      {label}
    </button>
  )
}

interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix: string
  onChange: (value: number) => void
}

function RangeField({ label, value, min, max, step = 1, suffix, onChange }: RangeFieldProps) {
  const progress = ((value - min) / (max - min)) * 100
  return (
    <label className="range-field">
      <span className="range-label">
        <span>{label}</span>
        <output>{Number.isInteger(value) ? value : value.toFixed(1)}{suffix}</output>
      </span>
      <span className="range-control">
        <Minus size={13} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ '--range-progress': `${progress}%` } as React.CSSProperties}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="range-plus">+</span>
      </span>
    </label>
  )
}

