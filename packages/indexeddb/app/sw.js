/* eslint-disable no-restricted-globals */
console.log('Service worker -> IndexedDB playground waking up!');

const DB_CONFIG = {
  name: 'Articles',
  version: 1,
  storeName: 'articles',
};

/**
 * Source and idea:
 * https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 */
function openDB() {
  return self.indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
}

async function initDB() {
  const promise = new Promise((resolve, reject) => {
    const request = openDB();

    request.onerror = e => {
      console.error('IndexedDB error', request.error);
      reject(e);
    };

    request.onsuccess = e => {
      resolve(e.target.result);
    };
  });

  return promise;
}

async function getArticleStore(mode) {
  const db = await initDB();
  const tx = db.transaction(DB_CONFIG.storeName, mode);
  const store = tx.objectStore(DB_CONFIG.storeName);

  return store;
}

async function findArticleByTitle(title) {
  const store = await getArticleStore();

  const promise = new Promise(resolve => {
    store.get(title).onsuccess = e => {
      resolve(e.target.result);
    };
  });

  return promise;
}

self.addEventListener('install', () => {
  console.log('Service Worker installed.');
});

self.addEventListener('activate', () => {
  console.log('Service Worker activating.');
});

self.addEventListener('message', async e => {
  if (self.indexedDB) {
    const records = await findArticleByTitle(e.data);
  }
});
