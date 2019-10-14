import { findOrcreateRecord } from './IndexedDB/article-store';

async function removeOldServiceWorkers() {
  const promise = new Promise(resolve => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (const registration of registrations) {
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

  await removeOldServiceWorkers();

  await registerServiceWorker();

  articleSubmitButton.addEventListener('click', async e => {
    e.preventDefault();
    const title = titleTextField.value;

    const channel = new MessageChannel();
    articleDataBySW(channel).then(response => {
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

async function indexDBOnlyComponents() {
  const textField = document.getElementById('indexdbArticleTextField');
  const submitButton = document.getElementById('indexdbArticleSubmitButton');
  const codeComponent = document.getElementById('indexdbArticleCode');

  submitButton.addEventListener('click', async e => {
    e.preventDefault();
    const title = textField.value;

    const dbArticle = await findOrcreateRecord(title);
    codeComponent.innerHTML = JSON.stringify(dbArticle);
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    swComponents();
    indexDBOnlyComponents();
  });
}
