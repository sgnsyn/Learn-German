const timeInput = document.getElementById("time-input");
const correctAnswerElt = document.getElementById("correct-answer");
const questionElt = document.getElementById("question");
const resetBtn = document.getElementById("reset-btn");

let answer = "zwei Uhr";
let time = [["02:00", "zwei Uhr"]];
let index = 0;

async function getTime() {
  const res = await fetch("./time.json");
  const data = await res.json();
  return data;
}

function timeInputHandler(event) {
  const input = event.target;
  if (input.value == answer) {
    correctAnswerElt.textContent = answer + " correct";
    timeInput.classList.add("correct");
  } else {
    correctAnswerElt.textContent =
      "Wrong Answer. " + "Correct Answer: " + answer;
    input.classList.add("wrong");
  }
  input.disabled = true;
  resetBtn.focus();
}

function updateTime(time) {
  timeInput.classList.remove("correct", "wrong");
  const randomIndex = Math.floor(Math.random() * time.length);
  index = randomIndex;
  answer = time[index][1];
  const newTime = time[randomIndex];
  questionElt.innerText = newTime[0];
  timeInput.disabled = false;
  timeInput.style.minWidth = `${answer.length + 2}ch`;
}

async function loadHandler() {
  time = await getTime();
  updateTime(time);
  timeInput.addEventListener("change", timeInputHandler);
  resetBtn.addEventListener("click", resetHandler);
  timeInput.focus();
}

async function resetHandler() {
  updateTime(time);
  correctAnswerElt.textContent = "";
  timeInput.value = "";
  timeInput.focus();
}

window.addEventListener("load", loadHandler);
