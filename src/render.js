import { delay } from "./delay.js";
import { now } from "./time.js";
import { getComments } from "./api.js";

const comments = document.querySelector(".comments");
const startLoader = document.querySelector(".start-loader");

export const getAndRenderComments = (commentsArr) => {
  getComments()
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
      renderComments(commentsArr);
    })
    .catch((error) => {
      alert(error.message);
      console.warn(error.message);
    });
};

const initEventListeners = (commentsArr) => {
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
        renderComments(commentsArr);
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

      renderComments(commentsArr);
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
      renderComments(commentsArr);
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

const renderComments = (commentsArr) => {
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

  initEventListeners(commentsArr);
};
