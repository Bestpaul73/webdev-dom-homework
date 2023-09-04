import { getTodos, addTodo } from "./api.js";
import { renderTasks } from './render.js';

const buttonElement = document.getElementById("add-button");
const textInputElement = document.getElementById("text-input");

let tasks = [];

const fetchAndRenderTasks = () => {
  getTodos()
    .then((responseData) => {
        tasks = responseData.todos;
        renderTasks(tasks);
    })
    .catch(() => {
      alert("Кажется, что-то пошло не так, попробуй позже");
      // TODO: Отправлять в систему сбора ошибок
      console.warn(error);
    });
};

fetchAndRenderTasks();

buttonElement.addEventListener("click", () => {
  if (textInputElement.value === "") {
    return;
  }

  buttonElement.disabled = true;
  buttonElement.textContent = "Элемент добавляется...";

  addTodo({
    text: textInputElement.value,
  })
    .then(() => {
      buttonElement.textContent = "Загружаю список…";
    })
    .then(() => fetchAndRenderTasks())
    .then(() => {
      buttonElement.disabled = false;
      buttonElement.textContent = "Добавить";
      textInputElement.value = "";
    })
    .catch((error) => {
      buttonElement.disabled = false;
      buttonElement.textContent = "Добавить";

      alert(error.message);
      if (error.message === "Сервер упал") {
        // Пробуем снова, если сервер сломался
        addTodo(text);
      }
      // TODO: Отправлять в систему сбора ошибок
      console.warn(error.message);
    });
});
