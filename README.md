# Watermark ID

A private, installable web tool for cropping and watermarking ID-card photos. The app runs entirely in the browser: images are decoded, cropped, watermarked, and exported on the user's device.

## Features

- Browser-only image processing with no uploads, analytics, or tracking
- Optional ISO/IEC 7810 ID-1 crop (85.60 × 53.98 mm proportions)
- Drag-to-position crop with adjustable zoom
- Custom target company, purpose, and local date
- Locally saved default presets that automatically refresh to the current date
- Multi-image batches with one-click ZIP export
- Diagonal, horizontal, and focused watermark patterns
- Adjustable opacity, text size, spacing, angle, and color
- JPEG, PNG, and WebP output with quality controls
- Installable offline experience backed by a service worker
- Responsive, touch-friendly interface
- Automatic browser-language detection with a persistent English, French, Italian, Spanish, and German switcher
- Sticky preview that remains visible while editing long settings panels

## Development

This project requires a recent Node.js release and [pnpm](https://pnpm.io/).

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL shown by Vite. The GitHub Pages base path is configured as `/watermark-id/`.

## Verification

```bash
pnpm test
pnpm build
pnpm test:e2e
```

## Privacy model

The app has no server-side component. Imported files and batches remain in browser memory, and the downloaded images are newly rendered through Canvas, which also avoids carrying source-file metadata into the export. Saved presets contain only editor settings in local storage—never image data. The service worker caches only the application shell and same-origin static assets required for offline use.
