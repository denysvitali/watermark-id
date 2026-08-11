import { expect, test } from '@playwright/test'

const sampleId = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
  <rect width="1200" height="760" rx="48" fill="#dfe9f4"/>
  <rect x="58" y="58" width="1084" height="644" rx="30" fill="#f8fbff" stroke="#b7cce0" stroke-width="4"/>
  <circle cx="288" cy="325" r="130" fill="#b6c8d8"/>
  <path d="M140 598c20-112 91-176 148-176s128 64 148 176" fill="#91a8bb"/>
  <rect x="515" y="210" width="470" height="35" rx="17" fill="#8299ae"/>
  <rect x="515" y="284" width="370" height="26" rx="13" fill="#b6c8d8"/>
  <rect x="515" y="344" width="420" height="26" rx="13" fill="#b6c8d8"/>
  <rect x="515" y="404" width="330" height="26" rx="13" fill="#b6c8d8"/>
  <text x="515" y="520" font-family="Arial" font-size="46" font-weight="700" fill="#4b647b">SAMPLE ID</text>
</svg>`

test('loads, customizes, crops, and downloads an ID', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: /share your id/i })).toBeVisible()

  await page.locator('input[type="file"]').first().setInputFiles({
    name: 'sample-id.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from(sampleId),
  })

  await expect(page.getByLabel(/watermarked id preview/i)).toBeVisible()
  await page.getByLabel('Target company').fill('Northstar Bank')
  await page.getByLabel('Use credit card crop').check()
  await expect(page.getByText(/ID-1 · 85\.60/)).toBeVisible()
  await page.getByRole('button', { name: 'Focus' }).click()

  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: /download watermarked id/i }).click()
  const download = await downloadEvent

  expect(download.suggestedFilename()).toBe('sample-id-watermarked.jpg')
})

test('loads the complete application shell while offline', async ({ page, context }) => {
  await page.goto('./')
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)

  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { name: /share your id/i })).toBeVisible()
})

