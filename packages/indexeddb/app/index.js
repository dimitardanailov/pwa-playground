if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const titleTextField = document.getElementById('title');
    const articleSubmitButton = document.getElementById('articleSubmitButton');

    navigator.serviceWorker.register('/sw.js').then(swReg => {
      console.log('Service Worker is registered', swReg);

      articleSubmitButton.addEventListener('click', async e => {
        e.preventDefault();
        const article = titleTextField.value;

        // Send message to service worker
        navigator.serviceWorker.controller.postMessage(article);
      });
    });
  });
}
