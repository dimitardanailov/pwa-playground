/* eslint-disable no-restricted-globals */
console.log('Service worker -> IndexedDB playground waking up!');

const DB_CONFIG = {
  name: 'Articles',
  version: 1,
  storeName: 'articles',
};

const DB_TRANSACTION_MODES = {
  readonly: 'readonly',
  readwrite: 'readwrite',
  versionchange: 'versionchange',
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
  const objectStore = await getArticleStore(DB_TRANSACTION_MODES.readonly);
  const index = objectStore.index('title');

  const promise = new Promise((resolve, reject) => {
    const getRequest = index.get(title);

    getRequest.onsuccess = e => {
      resolve(e.target.result);
    };

    getRequest.onerror = e => {
      console.error(e);
      reject(e);
    };
  });

  return promise;
}

async function createArticle(title) {
  const store = await getArticleStore(DB_TRANSACTION_MODES.readwrite);

  const promise = new Promise((resolve, reject) => {
    const requestAdd = store.add({
      title,
    });

    requestAdd.onsuccess = e => {
      console.log('e', e);
      resolve(e.target.result);
    };

    requestAdd.onerror = err => {
      console.error(err);
      reject(err);
    };
  });

  return promise;
}

async function addArticleCommand(e) {
  const { title } = e.data;
  const records = await findArticleByTitle(title);
  let response = records;

  if (typeof records === 'undefined') {
    const id = await createArticle(title);
    response = {
      id,
      title,
    };
  }

  e.ports[0].postMessage(response);
}

self.addEventListener('install', () => {
  // ONLY DEV MODE
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // eslint-disable-next-line no-undef
  e.waitUntil(clients.claim());
});

self.addEventListener('message', async e => {
  console.log('command:', e.data.command);
  if (e.data.command === 'addArticle' && self.indexedDB) {
    console.log('event', e);
    await addArticleCommand(e);
  }
});
