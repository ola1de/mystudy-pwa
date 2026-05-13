/* MyStudy Ultra Service Worker */
const CACHE_NAME = 'mystudy-v3';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// This handles the background notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const c of clientsArr) {
        if ('focus' in c) {
          c.navigate(url).catch(() => {});
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// This is the background listener that allows the phone to wake up 
// the app even if it is closed.
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkNewPostsInBackground());
  }
});

async function checkNewPostsInBackground() {
  // This triggers a silent fetch to your blogger feed to see if something is new
  try {
    const response = await fetch('/feeds/posts/default?alt=json&max-results=1');
    const data = await response.json();
    const latestPost = data.feed.entry[0];
    const title = latestPost.title.$t;
    
    // We don't want to spam, but this keeps the background process 'warm'
    console.log("Background check completed for: " + title);
  } catch (e) {
    console.error("Background check failed", e);
  }
}
