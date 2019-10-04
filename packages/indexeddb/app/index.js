import {
  initDB,
  findArticleByTitle,
  findArticlesByIndex,
} from './IndexedDB/article-store';

async function registerServiceWorker() {
  const promise = new Promise(resolve => {
    navigator.serviceWorker.register('/sw.js').then(swReg => {
      resolve(swReg);
    });
  });

  return promise;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    // Init db
    const db = await initDB();

    const titleTextField = document.getElementById('title');
    const articleSubmitButton = document.getElementById('articleSubmitButton');

    const worker = await registerServiceWorker();
    console.log('Service Worker is registered', worker);

    articleSubmitButton.addEventListener('click', async e => {
      e.preventDefault();
      const title = titleTextField.value;

      const dbArticle = await findArticleByTitle(db, title);
      if (dbArticle === null) {
        const channel = new MessageChannel();
        channel.port1.onmessage = event => {
          console.log('Response the SW : ', event.data.message);
        };
        navigator.serviceWorker.controller.postMessage(
          {
            command: 'addArticle',
            title,
          },
          [channel.port2]
        );
      }

      const dbArticles = await findArticlesByIndex(db, 'title', title);
      console.log('articles', dbArticles);
    });
  });
}
