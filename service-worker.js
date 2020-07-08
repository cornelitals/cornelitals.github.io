importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

if (workbox) 
    console.log("Workbox successfully loaded")
else 
    console.log("Workbox failed to load")

workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/standing.html', revision: '1' },
    { url: '/schedule.html', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/index.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/register.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/index.js', revision: '1' },
    { url: '/js/schedule.js', revision: '1' },
    { url: '/js/standing.js', revision: '1' },
    { url: '/pages/home.html', revision: '1' },
    { url: '/pages/favorite.html', revision: '1' },
    { url: '/images/BL1.png', revision: '1' },
    { url: '/images/BSA.png', revision: '1' },
    { url: '/images/CL.png', revision: '1' },
    { url: '/images/DED.png', revision: '1' },
    { url: '/images/EC.png', revision: '1' },
    { url: '/images/ELC.png', revision: '1' },
    { url: '/images/FL1.png', revision: '1' },
    { url: '/images/PD.png', revision: '1' },
    { url: '/images/PL.png', revision: '1' },
    { url: '/images/PPL.png', revision: '1' },
    { url: '/images/SA.png', revision: '1' },
    { url: '/images/WC.png', revision: '1' },
    { url: '/images/bola.png', revision: '1' },
    { url: '/images/icon/favicon-16x16.png', revision: '1' },
    { url: '/images/icon/favicon-32x32.png', revision: '1' },
    { url: '/images/icon/apple-touch-icon.png', revision: '1' },
    { url: '/images/icon/android-chrome-192x192.png', revision: '1' },
    { url: '/images/icon/android-chrome-512x512.png', revision: '1' },
    { url: '/images/icon/safari-pinned-tab.svg', revision: '1' },
], {
    ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "api-football-league",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 30
            })
        ]
    })
);

self.addEventListener("push", function(event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    const options = {
        body: body,
        icon: "images/icon/android-chrome-512x512.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});