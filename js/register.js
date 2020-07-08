// Check service worker
if (!('serviceWorker' in navigator)) {
    console.log("Service worker tidak didukung browser ini.");
} else {
    registerServiceWorker();
    requestPermission();
}

// Register service worker
function registerServiceWorker() {
    return navigator.serviceWorker.register('../service-worker.js')
        .then(function (registration) {
            console.log("ServiceWorker registration successful");
            return registration;
        })
        .catch(function (err) {
            console.error("ServiceWorker registration failed", err);
        });
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

// Request permission for push notification
function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Notification feature denied.");
                return;
            } else if (result === "default") {
                console.error("The permission request dialog box closed by the user.");
                return;
            }
            
            if (('PushManager' in window)) {
                navigator.serviceWorker.getRegistration().then(function(registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array("BCiLSKZipmYhF8J08Y01vXif23cFiWJe4rEG0yEQXjngVQ5bnySbsHvI8hbPJQtZ0_0-7PiDUZwyphuRuL6Qnrs")
                    }).then(function(subscribe) {
                        console.log("Successfully subscribed with endpoint: ", subscribe.endpoint);
                        console.log("Successfully subscribed with p256dh key: ", btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('p256dh')))));
                        console.log("Successfully subscribed with auth key: ", btoa(String.fromCharCode.apply(
                            null, new Uint8Array(subscribe.getKey('auth')))));
                    }).catch(function(e) {
                        console.error("Can't subscribe ", e.message);
                    });
                });
            }
        });
    }
};