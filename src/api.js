const baseURL = `https://wedev-api.sky.pro/api/v2/pavel-palkin`;
const registerURL = `https://wedev-api.sky.pro/api/user`;
const loginURL = `https://wedev-api.sky.pro/api/user/login`;

let token;

export const setToken = (newToken) => {
  token = newToken;
};

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

export const addComment = ({ text }) => {
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
    if (response.status === 401) {
      console.log('я тут');
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
    console.log(response);

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
