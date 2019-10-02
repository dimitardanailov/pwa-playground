import articleStore from './IndexedDB/article-store';

window.addEventListener('load', async () => {
  await articleStore();
});
