// Development service worker: does nothing, so you always see fresh files while developing.
// The published build uses service-worker.published.js, which caches the app for offline use.
self.addEventListener('fetch', () => { });
