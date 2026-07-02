const CACHE_NAME="whoosh-v1";

const urls=[

"/",
"index.html",
"style.css",
"app.js",
"manifest.json"

];

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME).then(cache=>cache.addAll(urls))

);

});

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request).then(response=>{

return response||fetch(event.request);

})

);

});
