import { openDB } from 'idb/with-async-ittr.js';

const storeName = 'articles';

async function initDB() {
  const db = await openDB('Articles', 1, {
    upgrade(_db) {
      // Create a store of objects
      const store = _db.createObjectStore(storeName, {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'date' property of the objects.
      store.createIndex('date', 'date');

      store.createIndex('title', 'title', { unique: true });
    },
  });

  return db;
}

async function findArticlesByIndex(db, indexName, search) {
  const index = db.transaction(storeName).store.index(indexName);
  const records = index.get(search);

  return records;
}

async function findArticleByTitle(db, title) {
  let article = null;
  const tx = db.transaction(storeName, 'readonly');

  for await (const cursor of tx.store) {
    if (cursor.value.title === title) article = cursor.value;
  }

  return article;
}

async function findOrcreateRecord(title) {
  const db = await initDB();

  let article = findArticlesByIndex(db, 'title', title);
  if (article === null) {
    db.add({ title })
      .then(response => (article = response))
      .catch(e => console.log(e));
  }

  return article;
}

export { initDB, findArticleByTitle, findArticlesByIndex, findOrcreateRecord };
