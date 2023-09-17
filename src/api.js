const baseURL = `https://wedev-api.sky.pro/api/v2/pavel-palkin`;
const registerURL = `https://wedev-api.sky.pro/api/user`;
const loginURL = `https://wedev-api.sky.pro/api/user/login`;

export const getComments = () => {
  return fetch(`${baseURL}/comments`, {
    method: 'GET',
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Сервер сломался, попробуй позже');
    }
  });
};

export const addComment = ({ text, token }) => {
  return fetch(`${baseURL}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      text: text,
      //   forceError: true,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(`Имя и комментарий должны быть не короче 3 символов`);
    }
    if (response.status === 500) {
      throw new Error(`Сервер сломался, попробуй позже`);
    }
    if (response.status === 401) {
      console.log('я тут');
    }
  });
};

export const delComment = ({ commentID, token }) => {
  return fetch(`${baseURL}/comments/${commentID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error(`Ошибка авторизации`);
    }
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже');
    }
  });
};

export function login({ login, password }) {
  return fetch(loginURL, {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(`Нет авторизации`);
    }
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже');
    }
  });
}

export function registration({ name, login, password }) {
  return fetch(registerURL, {
    method: 'POST',
    body: JSON.stringify({
      name,
      login,
      password,
    }),
  }).then((response) => {
    console.log(response);

    if (response.status === 201) {
      return response.json();
    }
    if (response.status === 400) {
      throw new Error(`Пользователь с таким логином уже существует`);
    }
    if (response.status === 500) {
      throw new Error('Сервер сломался, попробуй позже');
    }
  });
}
