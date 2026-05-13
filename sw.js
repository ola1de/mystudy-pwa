/* MyStudy Service Worker
 * Host this file at your blog's domain root (e.g. https://yourblog.com/sw.js).
 * It does NOT cache pages — its only job is to keep notifications working
 * when your installed PWA is in the background or closed.
 *
 * If you can't put it at the exact root (Blogger doesn't allow that), serve
 * it from a subdomain you control (Cloudflare Pages, GitHub Pages, Netlify)
 * mapped to that root, or wire your domain to a small static host that just
 * proxies / and serves /sw.js.
 */
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const c of clientsArr) {
        if ('focus' in c) { c.navigate(url).catch(() => {}); return c.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

/* Optional: if you later add a real Web Push backend, wire it here.
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(data.title || 'MyStudy', {
    body: data.body || '',
    icon: data.icon || '/favicon.ico',
    data: { url: data.url || '/' }
  }));
});
*/
