const questionCard = document.getElementById("question-card");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const explanationText = document.getElementById("explanation-text");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let questions = [];
let currentQuestionIndex = 0;

async function fetchQuestions() {
  try {
    const response = await fetch("./exercise.json");
    questions = await response.json();
    displayQuestion(currentQuestionIndex);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function displayQuestion(index) {
  const question = questions[index];
  questionText.innerHTML = `${index + 1}) ${question.question}`;
  answerOptions.innerHTML = "";
  explanationText.textContent = "";

  for (const option in question.options) {
    const label = document.createElement("label");
    label.classList.add("answer-option");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = option;
    radio.addEventListener("change", handleAnswerSelection);

    label.appendChild(radio);
    label.appendChild(document.createTextNode(question.options[option]));
    answerOptions.appendChild(label);
  }

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === questions.length - 1;
}

function handleAnswerSelection(event) {
  const selectedOption = event.target.value;
  const correctAnswer = questions[currentQuestionIndex].correct_answer;

  const options = document.querySelectorAll(
    '.answer-option input[type="radio"]',
  );
  options.forEach((option) => {
    const radio = option.parentElement.firstChild;
    if (option.value === correctAnswer && option.value === selectedOption) {
      radio.classList.add("correct");
    } else if (option.value === correctAnswer) {
      radio.classList.add("was-correct");
    } else if (option.value === selectedOption) {
      radio.classList.add("incorrect");
    }
    option.disabled = true;
  });

  explanationText.textContent = questions[currentQuestionIndex].explanation;
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

fetchQuestions();
