/* Self-deregistering stub.
 * Earlier we shipped a coi-serviceworker that injected COOP/COEP to enable
 * cross-origin isolation, but the real bug it was meant to work around
 * (the _BLOCKED NameError in the sandbox prelude) had nothing to do with
 * SharedArrayBuffer. The SW remained in production, broke Firefox auth
 * (intermittent 401 on the Edge Function POST), and provided no benefit.
 *
 * This stub replaces the old SW so any browser still controlled by it
 * deregisters itself on the next update check, then reloads the page so
 * subsequent navigations bypass the SW entirely. The <script> tag that
 * registers this file is also removed from index.html so new visits don't
 * re-install it.
 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister()
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((c) => c.navigate(c.url)))
  );
});
