window.addEventListener('load', async () => {
  const titleTextField = document.getElementById('title');
  const articleSubmitButton = document.getElementById('articleSubmitButton');

  articleSubmitButton.addEventListener('click', async e => {
    e.preventDefault();
    const article = titleTextField.value;
  });
});
