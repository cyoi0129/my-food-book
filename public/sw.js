// 軽量サービスワーカー（workbox 不使用）
// App Shell をキャッシュし、ナビゲーションはネットワーク優先＋オフラインフォールバック。
const CACHE = 'my-food-book-v2';
const APP_SHELL = ['/', '/task', '/master', '/user', '/manifest.webmanifest', '/favicon.ico', '/logo192.png', '/logo512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // 一部が 404 でも install 全体を失敗させない（個別に握りつぶす）。
      .then((cache) => Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => undefined))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// 例外を投げないキャッシュ書き込み（スキーム不一致などを吸収）。
const putInCache = async (request, response) => {
  try {
    const cache = await caches.open(CACHE);
    await cache.put(request, response);
  } catch {
    // chrome-extension:// など put できないリクエストは無視する。
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // GET 以外・http(s) 以外（chrome-extension:// 等）・クロスオリジンはSWが介入しない。
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (url.origin !== self.location.origin) return;

  // ページ遷移: ネットワーク優先、失敗時はキャッシュ（オフライン対応）。
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(request, response.clone());
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('/')) || Response.error())
    );
    return;
  }

  // 静的アセット: キャッシュ優先、無ければ取得してキャッシュ。取得失敗時もエラーにしない。
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            putInCache(request, response.clone());
          }
          return response;
        })
        .catch(() => cached || Response.error());
    })
  );
});
