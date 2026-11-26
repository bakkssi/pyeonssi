/* 관리 페이지 앱용 서비스 워커
   - 관리 페이지 화면(admin.html · 아이콘 · 앱 정보)만 담아둬요. 상세페이지나 GitHub 저장에는 끼어들지 않아요.
   - 항상 새 버전을 먼저 받아오고, 인터넷이 안 될 때만 담아둔 화면을 보여줘요. */
const CACHE = 'pyeonssi-admin-v1';
const FILES = ['admin.html', 'admin.webmanifest', 'admin-icon-192.png', 'admin-icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('pyeonssi-admin-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;     // GitHub 저장 · 다른 주소는 그대로
  const name = url.pathname.split('/').pop();
  if (!FILES.includes(name)) return;                                           // 관리 페이지 파일만 담당
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
