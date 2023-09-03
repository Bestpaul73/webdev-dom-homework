const plusZero = (str) => {
  return str < 10 ? `0${str}` : str;
};

export const now = (currentDate) => {
  let date = plusZero(currentDate.getDate());
  let month = plusZero(currentDate.getMonth() + 1);
  let hours = plusZero(currentDate.getHours());
  let mins = plusZero(currentDate.getMinutes());
  return `${date}.${month}.${currentDate.getFullYear() % 100} ${hours}:${mins}`;
};
