const CACHE_NAME = 'watermark-id-v2'
const STATIC_ASSETS = ['./manifest.webmanifest', './icon.svg']

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME)
  const indexUrl = new URL('./index.html', self.location.href)
  const rootUrl = new URL('./', self.location.href)
  const response = await fetch(indexUrl, { cache: 'reload' })
  const html = await response.clone().text()
  const discoveredAssets = Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g))
    .map((match) => new URL(match[1], rootUrl))
    .filter((url) => url.origin === self.location.origin)
    .map((url) => url.href)

  await cache.put(indexUrl, response.clone())
  await cache.put(rootUrl, response)
  await cache.addAll([...STATIC_ASSETS, ...new Set(discoveredAssets)])
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) return

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      const networkResponse = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html')
          }
          return undefined
        })

      return cached || networkResponse
    }),
  )
})
