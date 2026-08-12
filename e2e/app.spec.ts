import { expect, test } from '@playwright/test'

const samplePng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('landing page stays on one screen and links to the source', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: /watermark your id/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /view source on github/i })).toHaveAttribute(
    'href',
    'https://github.com/denysvitali/watermark-id',
  )
  await expect(page.getByRole('link', { name: 'MIT License' })).toHaveAttribute(
    'href',
    'https://github.com/denysvitali/watermark-id/blob/main/LICENSE',
  )
  const overflow = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  expect(overflow).toBeLessThanOrEqual(1)
})

test('loads, customizes, crops, and downloads an ID', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: /watermark your id/i })).toBeVisible()

  await page.locator('input[type="file"]').first().setInputFiles({
    name: 'sample-id.png',
    mimeType: 'image/png',
    buffer: samplePng,
  })

  await expect(page.getByLabel(/watermarked id preview/i)).toBeVisible()
  await page.getByLabel('Target company').fill('Northstar Bank')
  await page.getByRole('button', { name: 'Save default' }).click()
  await expect(page.getByRole('button', { name: 'Saved' })).toBeVisible()

  const viewport = page.viewportSize()!
  const stickyPreview = viewport.width <= 820
    ? page.locator('.canvas-stage')
    : page.locator('.preview-column')
  expect(await stickyPreview.evaluate((element) => getComputedStyle(element).position)).toBe('sticky')
  await page.getByRole('heading', { name: 'Export' }).scrollIntoViewIfNeeded()
  const previewBounds = await stickyPreview.boundingBox()
  expect(previewBounds).not.toBeNull()
  expect(previewBounds!.y + previewBounds!.height).toBeGreaterThan(0)
  expect(previewBounds!.y).toBeLessThan(viewport.height)

  await page.getByLabel('Use credit card crop').press('Space')
  await expect(page.getByText(/ID-1 · 85\.60/)).toBeVisible()
  await page.getByRole('button', { name: 'Focus' }).click()

  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: /download watermarked id/i }).click()
  const download = await downloadEvent

  expect(download.suggestedFilename()).toBe('sample-id-watermarked.jpg')
})

test('applies one configuration to a multi-image ZIP batch', async ({ page }) => {
  await page.goto('./')
  await page.locator('input[type="file"]').first().setInputFiles([
    { name: 'front.png', mimeType: 'image/png', buffer: samplePng },
    { name: 'back.png', mimeType: 'image/png', buffer: samplePng },
  ])

  await expect(page.getByText('1 of 2')).toBeVisible()
  await page.getByLabel('Target company').fill('Northstar Bank')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download batch (2)' }).click()
  const download = await downloadEvent

  expect(download.suggestedFilename()).toMatch(/^watermarked-ids-\d{4}-\d{2}-\d{2}\.zip$/)
})

test('loads the complete application shell while offline', async ({ page, context }) => {
  await page.goto('./')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true)

  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { name: /watermark your id/i })).toBeVisible()
})
