import _ from 'lodash';
import { login, registration } from './api.js';
import {
  getAndRenderComments,
  setUserName,
  commentsArr,
  setToken,
} from './renderCommentsPage.js';

const loginFormHTML = `
    <div class="login-form">
        <div class="login-form-title">Форма входа</div>
        <input
          type="login"
          class="login-form-login"
          placeholder="Введите логин"
        />
        <input
          type="password"
          class="login-form-password"
          placeholder="Введите пароль"
        />
        <button class="login-form-button-active">Войти</button>
        <button class="login-form-button-second">Зарегистрироваться</button>
    </div>
    `;

const registrationFormHTML = `
    <div class="login-form">
        <div class="login-form-title">Форма регистрации</div>
        <input
          type="text"
          class="login-form-name"
          placeholder="Введите имя"
        />
        <input
          type="login"
          class="login-form-login"
          placeholder="Введите логин"
        />
        <input
          type="password"
          class="login-form-password"
          placeholder="Введите пароль"
        />
        <button class="login-form-button-active">Зарегистрироваться</button>
        <button class="login-form-button-second">Войти</button>
    </div>
    `;

export const renderLogin = () => {
  const containerElement = document.querySelector('.container');
  containerElement.innerHTML = loginFormHTML;

  const loginInputElement = document.querySelector('.login-form-login');
  const passwordInputElement = document.querySelector('.login-form-password');
  const buttonLoginElement = document.querySelector(
    '.login-form-button-active',
  );
  const buttonRegistrationElement = document.querySelector(
    '.login-form-button-second',
  );

  buttonLoginElement.addEventListener('click', () => {
    login({
      login: loginInputElement.value,
      password: passwordInputElement.value,
    })
      .then((responseData) => {
        
        console.log(responseData.user.token);
        console.log(responseData.user.name);
        
        setToken(responseData.user.token);
        setUserName(responseData.user.name);
        if (confirm(`Запомнить пользователя на этом компьютере?`)) {
          localStorage.setItem('userName', responseData.user.name);
          localStorage.setItem('userToken', responseData.user.token);
        }
        getAndRenderComments(commentsArr);
      })
      .catch((error) => {
        if (error.message === 'Нет авторизации') {
          alert('Вы не прошли авторизацию, попробуйте еще раз');
        }

        if (error.message === 'Сервер сломался, попробуй позже') {
          alert(error.message);
        }

        if (window.navigator.onLine === false) {
          alert('Проблемы с интернетом, проверьте подключение');
        }

        console.warn(error);
        renderLogin();
      });
  });

  buttonRegistrationElement.addEventListener('click', () => {
    renderRegistration();
  });
};

const renderRegistration = () => {
  const containerElement = document.querySelector('.container');
  containerElement.innerHTML = registrationFormHTML;

  const nameInputElement = document.querySelector('.login-form-name');
  const loginInputElement = document.querySelector('.login-form-login');
  const passwordInputElement = document.querySelector('.login-form-password');
  const buttonLoginElement = document.querySelector(
    '.login-form-button-second',
  );
  const buttonRegistrationElement = document.querySelector(
    '.login-form-button-active',
  );

  buttonLoginElement.addEventListener('click', () => {
    renderLogin();
  });

  buttonRegistrationElement.addEventListener('click', () => {
    registration({
      name: _.capitalize(nameInputElement.value),
      login: loginInputElement.value,
      password: passwordInputElement.value,
    })
      .then((responseData) => {
        alert(`Пользователь ${responseData.user.name} успешно зарегистрирован`);
        renderLogin();
      })
      .catch((error) => {
        if (error.message === 'Пользователь с таким логином уже существует') {
          alert('Пользователь с таким логином уже существует');
        }

        if (error.message === 'Сервер сломался, попробуй позже') {
          alert(error.message);
        }

        if (window.navigator.onLine === false) {
          alert('Проблемы с интернетом, проверьте подключение');
        }

        console.warn(error);
        renderRegistration();
      });
  });
};
