const CACHE_NAME = "heydarzadeh-v4";

const FILES_TO_CACHE = [
  "index.html",
  "style.css",
  "app.js",
  "games-data.js",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});


// فایل‌های مهم همیشه نسخه جدید را بررسی می‌کنند
const NETWORK_FIRST_FILES = [
  "index.html",
  "app.js",
  "games-data.js",
  "style.css"
];


self.addEventListener("fetch", event => {

  const url = event.request.url;

  const isNetworkFirst = NETWORK_FIRST_FILES.some(file =>
    url.includes(file)
  );


  if (isNetworkFirst) {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, clone);
            });

          return response;

        })
        .catch(() => {
          return caches.match(event.request);
        })
    );

  } else {

    // بقیه فایل‌ها سریع از کش خوانده شوند
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );

  }

});