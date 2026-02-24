console.log('Страница загружена! Добро пожаловать!');
const title = document.querySelector('h1');
title.addEventListener('click', () => {
  title.style.color = title.style.color === 'blue' ? '#2c3e50' : 'blue';
});
