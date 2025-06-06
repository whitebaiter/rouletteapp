// キャッシュするファイルの名前とバージョンを指定
const CACHE_NAME = 'roulette-app-cache-v1';
// キャッシュするファイルのリスト
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// インストールイベント：ファイルをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチイベント：キャッシュがあればキャッシュから、なければネットワークから取得
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュが見つかった場合、それを返す
        if (response) {
          return response;
        }
        // 見つからなければネットワークにリクエストする
        return fetch(event.request);
      })
  );
});

// 古いキャッシュを削除する
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});