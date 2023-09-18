import { getComments } from './api.js';
import { renderLogin } from './renderLogin.js';
import { initComments } from './initComments.js';
import { format } from 'date-fns';

const invitationHTML = `<div class="invitation">Чтобы добавить комментарий, <span class="invitation-button">авторизуйтесь</span></div>`;
const addFormHTML = `
    <div class="comment-loader comment-loader-hidden">Комментарий загружается...</div>
    <div class="add-form">
      <input
        type="text"
        class="add-form-name"
        readonly
      />
      <textarea
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш комментарий"
        rows="4"
      ></textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
        <button class="add-form-logoff">Выйти</button>
      </div>
    </div>`;

// const startLoader = document.querySelector(".start-loader");
export let commentsArr = [];

// export let userName = null;
export let userName;
const getUserNameFromLocalStorage = () => {
  return (userName = localStorage.getItem('userName'));
};
userName = getUserNameFromLocalStorage();
export const setUserName = (userNewName) => {
  return userName = userNewName;
};

export let token;
const getUserTokenFromLocalStorage = () => {
  return (token = localStorage.getItem('userToken'));
};
token = getUserTokenFromLocalStorage();
export const setToken = (newToken) => {
  return token = newToken;
};

export const getAndRenderComments = (commentsArr) => {
  getComments()
    .then((responseData) => {
      commentsArr = responseData.comments.map((element) => {
        return {
          id: element.id,
          name: element.author.name,
          comment: element.text,
          date: format(new Date(element.date), `yyyy-MM-dd hh.mm.ss`),
          likesCounter: element.likes,
          myLike: element.isLiked,
          isEdit: false,
        };
      });
      // startLoader.classList.add("start-loader-hidden");
      renderCommentsPage(commentsArr);
    })
    .catch((error) => {
      alert(error.message);
      console.warn(error.message);
    });
};

export const renderCommentsPage = (commentsArr) => {
  console.log(commentsArr);
  const containerElement = document.querySelector('.container');
  containerElement.innerHTML = `
  <ul class="comments"></ul>
  ${userName ? addFormHTML : invitationHTML}
  `;

  const comments = document.querySelector('.comments');
  comments.innerHTML = commentsArr
    .map((comment, index) => {
      return `<li class="comment">
    <div class="comment-header">
    <div>${comment.name}</div>
    <div>${comment.date}</div>
    </div>
    ${
      comment.isEdit
        ? `<textarea
      class="edit-form-text"
      rows="2"
      >${comment.comment}</textarea>`
        : `<div class="comment-body">
      <div class="comment-text" data-index="${index}">
      ${comment.comment}
      </div>
          </div>`
    }
        <div class="comment-footer">
          ${
            comment.isEdit
              ? `<button data-index="${index}" class='save-btn'>Сохранить изменения</button>`
              : `<button data-index="${index}" class='edit-btn'>Редактировать комментарий</button>`
          }
        <button data-index="${index}" class="bin-button"><img src="./img/free-icon-delete-1345925.png" alt=""></button>  
        <div class="likes">
        <span class="likes-counter">${comment.likesCounter}</span>
        <button data-index="${index}" class='${
          comment.myLike ? 'like-button -active-like' : 'like-button'
        }'></button>
        </div>
        </div>
        </li>`;
    })
    .join('');

  if (!userName) {
    const invitationButton = document.querySelector('.invitation-button');
    invitationButton.addEventListener(`click`, () => {
      renderLogin();
    });
  } else {
    initComments(commentsArr);
  }
};
