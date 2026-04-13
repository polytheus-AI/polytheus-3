self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installing...");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activating...");
    event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
    // Basic fetch listener for future caching logic
});
