import { expect, test } from '@playwright/test'

const samplePng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
)

test('loads, customizes, crops, and downloads an ID', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: /share your id/i })).toBeVisible()

  await page.locator('input[type="file"]').first().setInputFiles({
    name: 'sample-id.png',
    mimeType: 'image/png',
    buffer: samplePng,
  })

  await expect(page.getByLabel(/watermarked id preview/i)).toBeVisible()
  await page.getByLabel('Target company').fill('Northstar Bank')
  await page.getByLabel('Use credit card crop').press('Space')
  await expect(page.getByText(/ID-1 · 85\.60/)).toBeVisible()
  await page.getByRole('button', { name: 'Focus' }).click()

  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: /download watermarked id/i }).click()
  const download = await downloadEvent

  expect(download.suggestedFilename()).toBe('sample-id-watermarked.jpg')
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

  await expect(page.getByRole('heading', { name: /share your id/i })).toBeVisible()
})
