// Geolux · guarda a tela no aparelho para abrir sem internet (diesel na mina)
const CACHE = "geolux-v1";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./"]).catch(() => {}))); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const guardar = r => { if (r && (r.ok || r.type === "opaque")) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); } return r; };
  if (url.origin === location.origin) {
    // a tela: busca a versão nova na internet; sem sinal, usa a guardada
    e.respondWith(fetch(req).then(guardar).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./"))));
  } else if (url.hostname === "cdn.jsdelivr.net") {
    // bibliotecas com versão fixa: usa a guardada
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(guardar)));
  }
});
