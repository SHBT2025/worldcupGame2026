// ============================================================
// 2026 FIFA 世界杯竞猜游戏 - Service Worker
// 版本: 1.0.0 | 更新: 2026-06-15
// ============================================================

const CACHE_NAME = 'worldcup2026-v1';

// 需要预缓存的资源
const PRECACHE_URLS = [
  'index.html',
  'manifest.json',
  'icon-48.png',
  'icon-72.png',
  'icon-96.png',
  'icon-144.png',
  'icon-192.png',
  'icon-512.png'
];

// ============================================================
// 安装阶段 - 预缓存核心资源
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 预缓存资源');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // 跳过等待，立即激活
      return self.skipWaiting();
    })
  );
});

// ============================================================
// 激活阶段 - 清理旧缓存
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] 激活中...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// ============================================================
// 请求拦截 - 网络优先策略
// ============================================================
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 忽略非 HTTP(S) 请求
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // API 请求不缓存
  if (url.hostname !== self.location.hostname) {
    // 外部资源（如 API）使用网络优先，失败时尝试缓存
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // 本地资源使用网络优先策略
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 只缓存成功的响应
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络离线时使用缓存
        return caches.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }
          // 对于 index.html 请求，返回缓存的 index.html
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
          return new Response('离线中...', { status: 503 });
        });
      })
  );
});
