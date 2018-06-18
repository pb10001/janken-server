"use strict";
exports.num2hand = num => {
  return num == 0 ? "グー" : num == 1 ? "チョキ" : num == 2 ? "パー" : null;
};
exports.hand2num = hand => {
  return hand === "stone"
    ? 0
    : hand === "scissors"
      ? 1
      : hand === "paper"
        ? 2
        : null;
};
exports.winner = (num1, num2) => {
  var res = null;
  if (num1 == 0) {
    if (num2 == 0) res = 2;
    else if (num2 == 1) res = 0;
    else if (num2 == 2) res = 1;
  } else if (num1 == 1) {
    if (num2 == 0) res = 1;
    else if (num2 == 1) res = 2;
    else if (num2 == 2) res = 0;
  } else if (num1 == 2) {
    if (num2 == 0) res = 0;
    else if (num2 == 1) res = 1;
    else if (num2 == 2) res = 2;
  }
  return res;
};
