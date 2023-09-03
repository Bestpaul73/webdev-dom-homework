export function getTodos() {
  return fetch("https://webdev-hw-api.vercel.app/api/todos", {
    method: "GET",
  }).then((response) => response.json());
}

export function delTodo(id) {
  return fetch("https://webdev-hw-api.vercel.app/api/todos/" + id, {
    method: "DELETE",
  }).then((response) => response.json());
}

export function addTodo({ text }) {
  return fetch("https://webdev-hw-api.vercel.app/api/todos", {
    method: "POST",
    body: JSON.stringify({
      text: text,
    }),
  }).then((response) => {
    console.log(response);
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(
        `Задачу "ничего" создать нельзя, займитесь чем-нибудь полезным`
      );
    } 
    if (response.status === 500) {
      throw new Error("Сервер упал");
    }
  });
}
