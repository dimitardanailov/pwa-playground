import {
  initDB,
  findArticleByTitle,
  findArticlesByIndex,
} from './IndexedDB/article-store';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    // Init db
    const db = await initDB();

    const titleTextField = document.getElementById('title');
    const articleSubmitButton = document.getElementById('articleSubmitButton');

    navigator.serviceWorker.register('/sw.js').then(swReg => {
      console.log('Service Worker is registered', swReg);

      articleSubmitButton.addEventListener('click', async e => {
        e.preventDefault();
        const article = titleTextField.value;

        const dbArticle = await findArticleByTitle(db, article);
        if (dbArticle === null) {
          navigator.serviceWorker.controller.postMessage(article);
        }

        const dbArticles = await findArticlesByIndex(db, 'title', article);
        console.log('articles', dbArticles);
      });
    });
  });
}
