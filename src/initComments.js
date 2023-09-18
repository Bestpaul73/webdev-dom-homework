import { delay } from './delay.js';
import { addComment, delComment } from './api.js';
import {
  userName,
  getAndRenderComments,
  renderCommentsPage,
  setUserName,
  setToken,
  token,
} from './renderCommentsPage.js';
import { format } from 'date-fns';

export const initComments = (commentsArr) => {
  let quoteGlobal = '';

  const initEventListeners = (commentsArr) => {
    const likeBtns = document.querySelectorAll('.like-button');
    for (const likeBtn of likeBtns) {
      likeBtn.addEventListener('click', (e) => {
        likeBtn.classList.add('-loading-like');
        delay(1000).then(() => {
          e.stopPropagation();
          const comment = commentsArr[likeBtn.dataset.index];
          comment.myLike ? --comment.likesCounter : ++comment.likesCounter;
          comment.myLike = !comment.myLike;
          likeBtn.classList.remove('-loading-like');
          renderCommentsPage(commentsArr);
        });
      });
    }

    const editBtns = document.querySelectorAll(".edit-btn");
    for (const editBtn of editBtns) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = editBtn.dataset.index;
        const comment = commentsArr[index];
        comment.isEdit = true;

        renderCommentsPage(commentsArr);
        document.querySelector(".edit-form-text").focus();
      });
    }

    const saveBtns = document.querySelectorAll(".save-btn");
    for (const saveBtn of saveBtns) {
      saveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const comment = commentsArr[saveBtn.dataset.index];

        const editFormText = saveBtn
          .closest(".comment")
          .querySelector(".edit-form-text");
        comment.comment = editFormText.value;

        let currentDate = new Date();
        comment.date = format(currentDate, `yyyy-MM-dd hh.mm.ss`);

        comment.isEdit = false;
        renderCommentsPage(commentsArr);
      });
    }

    const commentTextElements = document.querySelectorAll('.comment-text');
    for (const commentTextElement of commentTextElements) {
      commentTextElement.addEventListener('click', () => {
        if (!userName) return;
        const index = commentTextElement.dataset.index;
        const comment = commentsArr[index];

        quoteGlobal = `${comment.name}:\n${comment.comment}`;
        inputText.value = `"${quoteGlobal}"\n`;
        document.querySelector('.add-form-text').focus();
      });
    }

    const commentDeleteButtons = document.querySelectorAll('.bin-button');
    for (const commentDeleteButton of commentDeleteButtons) {
      commentDeleteButton.addEventListener('click', () => {
        const index = commentDeleteButton.dataset.index;
        const commentID = commentsArr[index].id;

        if (userName != commentsArr[index].name) {
          alert(`Вы можете удалить только свой комментарий`);
          return;
        }

        if (confirm(`Вы уверены, что хотите удалить свой комментарий?`)) {
          delComment({ commentID, token })
            .then(() => {
              getAndRenderComments(commentsArr);
            })
            .catch((error) => {
              if (error.message === 'Ошибка авторизации') {
                alert(error.message);
              }

              if (error.message === 'Сервер сломался, попробуй позже') {
                alert(error.message);
                // Пробуем снова, если сервер сломался
                delComment({ commentID, token });
              }

              if (window.navigator.onLine === false) {
                alert('Проблемы с интернетом, проверьте подключение');
              }

              console.warn(error);
            });
        }
      });
    }
  };

  const createNewComment = (commentsArr) => {
    addForm.classList.add('add-form-loader-hidden');
    commentLoader.classList.remove('comment-loader-hidden');

    addComment({
      text: inputText.value,
      token: token,
    })
      .then(() => {
        getAndRenderComments(commentsArr);
        inputName.value = '';
        inputText.value = '';
        addFormBtn.disabled = true;
        commentLoader.classList.add('comment-loader-hidden');
        addForm.classList.remove('add-form-loader-hidden');
      })
      .catch((error) => {
        if (
          error.message === 'Имя и комментарий должны быть не короче 3 символов'
        ) {
          alert(error.message);
        }

        if (error.message === 'Сервер сломался, попробуй позже') {
          alert(error.message);
          // Пробуем снова, если сервер сломался
          createNewComment(commentsArr);
        }

        if (window.navigator.onLine === false) {
          alert('Проблемы с интернетом, проверьте подключение');
        }

        console.warn(error);

        commentLoader.classList.add('comment-loader-hidden');
        addForm.classList.remove('add-form-loader-hidden');
      });
  };

  const commentLoader = document.querySelector('.comment-loader');
  const addFormBtn = document.querySelector('.add-form-button');
  const addFormLogOffBtn = document.querySelector('.add-form-logoff');
  const addForm = document.querySelector('.add-form');
  const inputName = document.querySelector('.add-form-name');
  const inputText = document.querySelector('.add-form-text');

  inputName.value = userName;
  addFormBtn.disabled = true;

  initEventListeners(commentsArr);

  document.addEventListener('input', () => {
    inputText.value != ''
      ? (addFormBtn.disabled = false)
      : (addFormBtn.disabled = true);
  });

  addFormLogOffBtn.addEventListener(`click`, () => {
    localStorage.removeItem('userName');
    setUserName(null);
    localStorage.removeItem('userToken');
    setToken(null);
    getAndRenderComments(commentsArr);
  });

  addFormBtn.addEventListener('click', () => {
    createNewComment(commentsArr);
  });

  document.addEventListener('keyup', (e) => {
    if (
      (e.code === 'Enter' || e.code === 'NumpadEnter') &&
      !addFormBtn.disabled
    ) {
      createNewComment(commentsArr);
    }
  });
};
