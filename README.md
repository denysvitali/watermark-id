# Watermark ID

A private, installable web tool for cropping and watermarking ID-card photos. The app runs entirely in the browser: images are decoded, cropped, watermarked, and exported on the user's device.

## Features

- Browser-only image processing with no uploads, analytics, or tracking
- Optional ISO/IEC 7810 ID-1 crop (85.60 × 53.98 mm proportions)
- Drag-to-position crop with adjustable zoom
- Custom target company, purpose, and local date
- Diagonal, horizontal, and focused watermark patterns
- Adjustable opacity, text size, spacing, angle, and color
- JPEG, PNG, and WebP output with quality controls
- Installable offline experience backed by a service worker
- Responsive, touch-friendly interface

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
```

## Privacy model

The app has no server-side component. Imported files remain in browser memory, and the downloaded image is newly rendered through Canvas, which also avoids carrying the source file's embedded metadata into the export. The service worker caches only the application shell and same-origin static assets required for offline use.

