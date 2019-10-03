/* eslint-disable no-restricted-globals */
console.log('Service worker -> IndexedDB playground waking up!');

self.addEventListener('install', () => {
  console.log('Service Worker installed.');
});

self.addEventListener('activate', () => {
  console.log('Service Worker activating.');
});

self.addEventListener('message', e => {
  console.log(`SW Received Message: ${e.data}`);
  console.log(e);
});
