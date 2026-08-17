/*
 * A tombstone.
 *
 * This file used to be a caching service worker, added while the field capture
 * app was briefly built inside the demo. The field app moved to its own
 * deployment and the pages were removed, but the worker stayed installed in
 * every browser that had visited — and it cached /_next/ chunks cache-first.
 * The result was that the demo kept serving JavaScript from weeks ago however
 * many times it was rebuilt and redeployed: a map that stayed black after the
 * colour was fixed, a button that appeared dead after it worked, and a
 * hydration mismatch caused by new server HTML meeting old client code.
 *
 * Deleting the file would not have helped. An installed worker keeps running
 * and keeps answering from its cache; the browser only replaces it when it
 * fetches a *different* sw.js. So this version stays in place, empties every
 * cache it finds, unregisters itself, and reloads the pages it controls. Once
 * a browser has run it, the demo is served straight from the network again.
 *
 * The demo does not want a service worker at all. Offline capability belongs
 * to the field app, which is installed deliberately by officers who need it.
 * A public record read once from a link should never be answered from a cache
 * a visitor did not know they had.
 */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
