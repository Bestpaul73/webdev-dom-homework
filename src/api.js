export const getComments = () => {
  return fetch("https://wedev-api.sky.pro/api/v1/pavel-palkin/comments", {
    method: "GET",
  }).then((response) => {
    console.log(response);
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error("Сервер сломался, попробуй позже");
    }
  });
};

export const addComment = ( { text, name }) => {
  return fetch("https://wedev-api.sky.pro/api/v1/pavel-palkin/comments", {
    method: "POST",
    body: JSON.stringify({
      text: text,
      name: name,
    //   forceError: true,
    }),
  }).then((response) => {
    console.log(response);
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(`Имя и комментарий должны быть не короче 3 символов`);
    }
    if (response.status === 500) {
      throw new Error(`Сервер сломался, попробуй позже`);
    }
  });
};
