import {
  initDB,
  findArticleByTitle,
  findArticlesByIndex,
} from './IndexedDB/article-store';

async function removeOldServiceWorkers() {
  const promise = new Promise(resolve => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (const registration of registrations) {
        console.log('remove service workers !!!!');
        registration.unregister();
      }

      resolve();
    });
  });

  return promise;
}

async function registerServiceWorker() {
  const promise = new Promise(resolve => {
    navigator.serviceWorker.register('/sw.js').then(swReg => {
      resolve(swReg);
    });
  });

  return promise;
}

async function articleDataBySW(channel) {
  const promise = new Promise(resolve => {
    channel.port1.onmessage = event => {
      resolve(event.data);
    };
  });

  return promise;
}

async function swComponents() {
  const titleTextField = document.getElementById('swArticleTitle');
  const articleSubmitButton = document.getElementById('swArticleSubmitButton');
  const codeComponent = document.getElementById('swArticleCode');

  removeOldServiceWorkers();

  const worker = await registerServiceWorker();
  console.log('Service Worker is registered', worker);

  articleSubmitButton.addEventListener('click', async e => {
    e.preventDefault();
    const title = titleTextField.value;

    const channel = new MessageChannel();
    articleDataBySW(channel).then(response => {
      console.log('response', response);
      codeComponent.innerHTML = JSON.stringify(response);
    });

    navigator.serviceWorker.controller.postMessage(
      {
        command: 'addArticle',
        title,
      },
      [channel.port2]
    );
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    swComponents();

    // Init db
    /*
    const db = await initDB();

    const titleTextField = document.getElementById('swArticleTitle');
    const articleSubmitButton = document.getElementById('articleSubmitButton');

    const worker = await registerServiceWorker();
    console.log('Service Worker is registered', worker);

    articleSubmitButton.addEventListener('click', async e => {
      e.preventDefault();
      const title = titleTextField.value;

      const dbArticle = await findArticleByTitle(db, title);
      if (dbArticle === null) {
        const channel = new MessageChannel();
        articleDataBySW(channel).then(response => {
          console.log('service worker response', response);
        });

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
    }); */
  });
}
