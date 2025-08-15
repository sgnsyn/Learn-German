const questionCard = document.getElementById("question-card");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const explanationText = document.getElementById("explanation-text");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const resetBtn = document.getElementById("reset-btn");

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

async function fetchQuestions() {
  try {
    const response = await fetch("./exercise.json");
    questions = await response.json();
    loadProgress();
    displayQuestion(currentQuestionIndex);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function loadProgress() {
  const savedAnswers = localStorage.getItem("germanCasesAnswers");
  if (savedAnswers) {
    userAnswers = JSON.parse(savedAnswers);
  }
  updateScore();

  if (userAnswers.length === 0) {
    currentQuestionIndex = 0;
  } else if (userAnswers.length === questions.length) {
    currentQuestionIndex = questions.length - 1;
  } else {
    let firstUnansweredIndex = -1;
    for (let i = 0; i < questions.length; i++) {
      if (!userAnswers.some((answer) => answer.questionIndex === i)) {
        firstUnansweredIndex = i;
        break;
      }
    }
    if (firstUnansweredIndex !== -1) {
      currentQuestionIndex = firstUnansweredIndex;
    } else {
      currentQuestionIndex = questions.length - 1;
    }
  }
}

function saveProgress() {
  localStorage.setItem("germanCasesAnswers", JSON.stringify(userAnswers));
}

function updateScore() {
  const correctAnswers = userAnswers.filter((answer) => {
    const question = questions[answer.questionIndex];
    return question && answer.selectedOption === question.correct_answer;
  }).length;
  scoreElement.textContent = `${correctAnswers}/${questions.length || "__"}`;
}

function displayQuestion(index) {
  const question = questions[index];
  questionText.innerHTML = `${index + 1}) ${question.question}`;
  answerOptions.innerHTML = "";
  explanationText.textContent = "";

  const userAnswer = userAnswers.find((ans) => ans.questionIndex === index);

  for (const option in question.options) {
    const label = document.createElement("label");
    label.classList.add("answer-option");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = option;

    label.appendChild(radio);
    label.appendChild(document.createTextNode(question.options[option]));
    answerOptions.appendChild(label);

    if (userAnswer) {
      radio.disabled = true;
      if (option === userAnswer.selectedOption) {
        radio.checked = true;
      }
    } else {
      radio.addEventListener("change", handleAnswerSelection);
    }
  }

  if (userAnswer) {
    showExplanationAndColors(userAnswer.selectedOption);
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === questions.length - 1;
}

function showExplanationAndColors(selectedOption) {
  const question = questions[currentQuestionIndex];
  const correctAnswer = question.correct_answer;

  const options = document.querySelectorAll(
    '.answer-option input[type="radio"]',
  );
  options.forEach((option) => {
    option.disabled = true;
    if (option.value === correctAnswer && option.value === selectedOption) {
      option.classList.add("correct");
    } else if (option.value === correctAnswer) {
      option.classList.add("was-correct");
    } else if (option.value === selectedOption) {
      option.classList.add("incorrect");
    }
  });

  explanationText.textContent = question.explanation;
}

function handleAnswerSelection(event) {
  const selectedOption = event.target.value;

  if (userAnswers.some((ans) => ans.questionIndex === currentQuestionIndex)) {
    return;
  }

  userAnswers.push({
    questionIndex: currentQuestionIndex,
    selectedOption: selectedOption,
  });

  saveProgress();
  updateScore();
  showExplanationAndColors(selectedOption);
}

function resetProgress() {
  userAnswers = [];
  localStorage.removeItem("germanCasesAnswers");
  currentQuestionIndex = 0;
  displayQuestion(currentQuestionIndex);
  updateScore();
}

function showNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
}

function showPrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
}

prevBtn.addEventListener("click", showPrevQuestion);
nextBtn.addEventListener("click", showNextQuestion);
resetBtn.addEventListener("click", resetProgress);

fetchQuestions();
