"use strict";
import { addComment } from "./api.js";
import { getAndRenderComments } from "./render.js";

let commentsArr = [];

const commentLoader = document.querySelector(".comment-loader");
const addFormBtn = document.querySelector(".add-form-button");
const addForm = document.querySelector(".add-form");
const inputName = document.querySelector(".add-form-name");
const inputText = document.querySelector(".add-form-text");
// const delFormBtn = document.querySelector(".del-form-button");



getAndRenderComments(commentsArr);
addFormBtn.disabled = true;

document.addEventListener("input", () => {
  inputName.value != "" && inputText.value != ""
    ? (addFormBtn.disabled = false)
    : (addFormBtn.disabled = true);
});

const createNewComment = () => {

  addForm.classList.add("add-form-loader-hidden");
  commentLoader.classList.remove("comment-loader-hidden");

  addComment({
    text: inputText.value,
    name: inputName.value,
  })
    .then(() => {
      getAndRenderComments(commentsArr);
      inputName.value = "";
      inputText.value = "";
      addFormBtn.disabled = true;
      commentLoader.classList.add("comment-loader-hidden");
      addForm.classList.remove("add-form-loader-hidden");
    })
    .catch((error) => {
      if (
        error.message === "Имя и комментарий должны быть не короче 3 символов"
      ) {
        alert(error.message);
      }

      if (error.message === "Сервер сломался, попробуй позже") {
        alert(error.message);
        // Пробуем снова, если сервер сломался
        createNewComment();
      }

      if (window.navigator.onLine === false) {
        alert("Проблемы с интернетом, проверьте подключение");
      }

      console.warn(error);

      commentLoader.classList.add("comment-loader-hidden");
      addForm.classList.remove("add-form-loader-hidden");
    });
};

addFormBtn.addEventListener("click", () => {
  createNewComment();
});

document.addEventListener("keyup", (e) => {
  if (
    (e.code === "Enter" || e.code === "NumpadEnter") &&
    !addFormBtn.disabled
  ) {
    createNewComment();
  }
});

// delFormBtn.addEventListener("click", () => {
//   commentsArr.pop();
//   renderComments();
//   if (!commentsArr) delFormBtn.disabled = true;
// });
