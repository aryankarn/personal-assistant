import { Workbox } from 'workbox-window';

export function registerSW() {
  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        if (confirm('New content is available! Click OK to refresh.')) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('activated', event => {
      if (!event.isUpdate) {
        console.log('Service worker activated for the first time!');
      }
    });

    // Register the service worker
    wb.register()
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(err => {
        console.log('Service Worker registration failed: ', err);
      });
  }
}