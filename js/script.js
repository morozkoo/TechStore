console.log("Страница загружена! Добро пожаловать!");

// Изменение цвета заголовка при клике
const title = document.querySelector("h1");
title.addEventListener("click", () => {
  title.style.color = title.style.color === "blue" ? "#2c3e50" : "blue";
});
