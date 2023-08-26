"use strict";

let commentsArr = [];

const startLoader = document.querySelector(".start-loader");
const commentLoader = document.querySelector(".comment-loader");
const comments = document.querySelector(".comments");
const addFormBtn = document.querySelector(".add-form-button");
const addForm = document.querySelector(".add-form");
// const delFormBtn = document.querySelector(".del-form-button");
const inputName = document.querySelector(".add-form-name");
const inputText = document.querySelector(".add-form-text");

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

const getAndRenderComments = () => {
  fetch("https://wedev-api.sky.pro/api/v1/pavel-palkin/comments", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((responseData) => {
      commentsArr = responseData.comments.map((element) => {
        return {
          name: element.author.name,
          comment: element.text,
          date: now(new Date(element.date)),
          likesCounter: element.likes,
          myLike: element.isLiked,
          isEdit: false,
        };
      });
      startLoader.classList.add("start-loader-hidden");
      renderComments();
      commentLoader.classList.add("comment-loader-hidden");
      addForm.classList.remove("add-form-loader-hidden");
    });
};

getAndRenderComments();

addFormBtn.disabled = true;

const initEventListeners = () => {
  const likeBtns = document.querySelectorAll(".like-button");
  for (const likeBtn of likeBtns) {
    likeBtn.addEventListener("click", (e) => {
      likeBtn.classList.add("-loading-like");
      delay(1000).then(() => {
        e.stopPropagation();
        const comment = commentsArr[likeBtn.dataset.index];
        comment.myLike ? --comment.likesCounter : ++comment.likesCounter;
        comment.myLike = !comment.myLike;
        likeBtn.classList.remove("-loading-like");
        renderComments();
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

      renderComments();
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
      comment.date = now(currentDate);

      comment.isEdit = false;
      renderComments();
    });
  }

  // const commentTextElements = document.querySelectorAll(".comment-text");
  // for (const commentTextElement of commentTextElements) {
  //   commentTextElement.addEventListener("click", () => {
  //     const index = commentTextElement.dataset.index;
  //     const comment = commentsArr[index];

  //     quoteGlobal = `${comment.name}:\n${comment.comment}`;
  //     inputText.value = `"${quoteGlobal}"\n`;
  //     document.querySelector(".add-form-text").focus();
  //   });
  // }
};

document.addEventListener("input", () => {
  inputName.value != "" && inputText.value != ""
    ? (addFormBtn.disabled = false)
    : (addFormBtn.disabled = true);
});

const plusZero = (str) => {
  return str < 10 ? `0${str}` : str;
};

const now = (currentDate) => {
  let date = plusZero(currentDate.getDate());
  let month = plusZero(currentDate.getMonth() + 1);
  let hours = plusZero(currentDate.getHours());
  let mins = plusZero(currentDate.getMinutes());
  return `${date}.${month}.${currentDate.getFullYear() % 100} ${hours}:${mins}`;
};

const renderComments = () => {
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
                <div class="likes">
                   <span class="likes-counter">${comment.likesCounter}</span>
                   <button data-index="${index}" class='${
        comment.myLike ? "like-button -active-like" : "like-button"
      }'></button>
                  </div>
                </div>
              </li>`;
    })
    .join("");

  inputName.value = "";
  inputText.value = "";
  addFormBtn.disabled = true;
  initEventListeners();
};

const createNewComment = () => {
  // let currentDate = new Date();
  // commentsArr.push({
  //   name: inputName.value
  //     .replaceAll("&", "&amp;")
  //     .replaceAll("<", "")
  //     .replaceAll(">", "")
  //     .replaceAll('"', "&quot;"),
  //   date: now(currentDate),
  //   comment: inputText.value
  //     .replaceAll("&", "&amp;")
  //     .replaceAll("<", "")
  //     .replaceAll(">", "")
  //     .replaceAll('"', "&quot;"),
  //   likesCounter: 0,
  //   myLike: false,
  // });
  // console.log(commentsArr);

  addForm.classList.add("add-form-loader-hidden");
  commentLoader.classList.remove("comment-loader-hidden");

  fetch("https://wedev-api.sky.pro/api/v1/pavel-palkin/comments", {
    method: "POST",
    body: JSON.stringify({
      text: inputText.value,
      name: inputName.value,
    }),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      getAndRenderComments();
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
