import { delTodo } from "./api.js";
import { sanitizeHtml } from "./sanitizeHtml.js";

export function renderTasks(tasks) {
  const tasksHtml = tasks
    .map((task) => {
      return `
        <li class="task">
        <p class="task-text">
        ${sanitizeHtml(task.text)}
        <button data-id="${
          task.id
        }" class="button delete-button">Удалить</button>
        </p>
        </li>`;
    })
    .join("");

  const listElement = document.getElementById("list");
  listElement.innerHTML = tasksHtml;

  const deleteButtons = document.querySelectorAll(".delete-button");

  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = deleteButton.dataset.id;

      delTodo(id)
        .then((responseData) => {
            console.log(responseData);
          tasks = responseData.todos;
          renderTasks(tasks);
        })
        .catch(() => {
          alert("Кажется, что-то пошло не так, попробуй позже");
          // TODO: Отправлять в систему сбора ошибок
          console.warn(error);
        });
    });
  }
}
