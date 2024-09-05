const choices = document.getElementById("subjects-form");
const subjectHeader = document.querySelector(".subject-heading-container");
const questionTemplate = document.getElementById("question-template");
const quizCompleteTemplate = document.getElementById("quiz-complete");
const contentArea = document.getElementById("content-area");
const controller = new AbortController();

const dataResponse = await fetch("data.json");
const data = await dataResponse.json();
const quizzes = data["quizzes"];
const quizzesObj = {};
for (const quiz of quizzes) {
  quizzesObj[quiz["title"]] = quiz;
}
console.log(quizzesObj);
let questionCount = 0;
let currentScore = 0;
let userChoiceLabel;
let firstPage;
const subjects = {
  js: "JavaScript",
  html: "HTML",
  css: "CSS",
  accessibility: "Accessibility",
};

function checkAnswer(e) {
  //   e.preventDefault();
  //   console.log(e.target.tagName);
  const choiceLabel = e.target.closest("label");
  const eleTagName = e.target.tagName;
  if (choiceLabel) {
    const choiceInput = choiceLabel.querySelector("input[type='radio'");
    choiceInput.checked = true;
    userChoiceLabel = choiceLabel;
  } else if (eleTagName === "BUTTON" && userChoiceLabel == undefined) {
    e.preventDefault();
    // console.log("no choice");
    document.getElementById("no-answer").classList.toggle("hide", false);
  } else if (eleTagName === "BUTTON") {
    e.preventDefault();

    const answer =
      quizzesObj[subjectHeader.dataset.subject].questions[questionCount].answer;
    const answerLabel = document.querySelector(
      `label[data-choice="${answer}"]`
    );
    // console.log(userChoiceLabel);
    const userChoice = userChoiceLabel.dataset.choice;
    if (answer === userChoice) {
      userChoiceLabel.insertAdjacentHTML(
        "beforeend",
        `<img src='/assets/images/icon-correct.svg' alt='checkmark'/>`
      );
      userChoiceLabel.classList.add("correct");

      for (const formEle of userChoiceLabel.parentElement.children) {
        formEle.disabled = true;
        formEle.style = "pointer-events: none;";
      }
      e.target.textContent = "Next Question";
      e.target.disabled = false;
      e.target.style = "";
      e.target.parentElement.removeEventListener("click", checkAnswer, true);

      e.target.addEventListener("mouseup", nextPage);
      currentScore++;
    } else if (answer !== userChoice) {
      userChoiceLabel.insertAdjacentHTML(
        "beforeend",
        `<img src='/assets/images/icon-incorrect.svg' alt='x'/>`
      );
      answerLabel.insertAdjacentHTML(
        "beforeend",
        `<img class="correct-img" src='/assets/images/icon-correct.svg' alt='checkmark'/>`
      );
      userChoiceLabel.classList.add("incorrect");

      for (const formEle of userChoiceLabel.parentElement.children) {
        formEle.disabled = true;
        formEle.style = "pointer-events: none;";
      }
      e.target.textContent = "Next Question";
      e.target.disabled = false;
      e.target.style = "";

      e.target.parentElement.removeEventListener("click", checkAnswer, true);

      e.target.addEventListener("mouseup", nextPage);
      // Might not neeeded since we should move to the next page
      if (!e.target.nextElementSibling.classList.contains("hide")) {
        e.target.nextElementSibling.classList.toggle("hide", true);
      }
    }
    questionCount++;
  }
}
function nextPage(e) {
  e.preventDefault();

  if (questionCount !== 10) {
    const subject = quizzesObj[subjectHeader.dataset.subject];

    const clone = questionTemplate.content.cloneNode(true);
    const choiceForm = clone.getElementById("choice-form");
    choiceForm.addEventListener("click", checkAnswer, true);
    userChoiceLabel = undefined;

    const question = clone.getElementById("question");
    question.textContent = subject.questions[questionCount].question;

    const questionMax = clone.getElementById("question-max");
    questionMax.textContent = `${subject.questions.length}`;

    const progress = clone.getElementById("progressbar");
    progress.setAttribute("value", questionCount);

    const questionNum = clone.getElementById("question-num");
    questionNum.textContent = `${questionCount + 1}`;

    const options = clone.querySelectorAll("label[data-choice]");

    for (
      let index = 0;
      index < subject.questions[questionCount].options.length;
      index++
    ) {
      options[index].dataset.choice =
        subject.questions[questionCount].options[index];
      options[index].children[2].textContent = options[index].dataset.choice;
    }

    contentArea.replaceChildren(clone);
  } else {
    quizComplete(e);
  }
}

function quizComplete(e) {
  const clone = quizCompleteTemplate.content.cloneNode(true);

  const finalScoreContainer = clone.getElementById("final-score-container");
  finalScoreContainer.insertAdjacentElement(
    "afterbegin",
    subjectHeader.cloneNode(true)
  );

  const finalScore = clone.getElementById("final-score");
  finalScore.textContent = `${currentScore}`;

  const maxFinalScore = clone.getElementById("max-final-score");
  maxFinalScore.textContent = `out of ${
    quizzesObj[subjectHeader.dataset.subject].questions.length
  }`;

  const playAgainBtn = clone.getElementById("play-again-btn");
  playAgainBtn.addEventListener("click", playAgain);
  contentArea.replaceChildren(clone);
}

function playAgain(e) {
  console.log("play again");
  contentArea.replaceChildren(...firstPage);

  subjectHeader.children[0].classList.toggle("hide", true);
  subjectHeader.children[1].textContent = "";
  currentScore = 0;
  questionCount = 0;
}

choices.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    const val = e.target.closest("label")?.dataset.value;

    if (val != undefined) {
      const img = subjectHeader.children[0];
      img.setAttribute("src", `assets/images/icon-${val}.svg`);
      img.setAttribute("alt", val);
      img.classList.toggle("hide", false);

      const headerText = subjectHeader.children[1];
      headerText.textContent = subjects[val];
      subjectHeader.dataset.subject = subjects[val];

      firstPage = [...contentArea.children];
      // console.log(subjectHeader.dataset.subject);
      nextPage(e);

      // console.log(firstPage);
      // Question Template
      // const clone = questionTemplate.content.cloneNode(true);
      // const choiceForm = clone.getElementById("choice-form");
      // choiceForm.addEventListener("click", checkAnswer, true);

      // const questionNum = clone.getElementById("question-num");
      // questionNum.textContent = `${questionCount}`;
      // const question = clone.getElementById("question");
      // question.textContent =
      //   quizzesObj[subjectHeader.dataset.subject].questions[
      //     questionCount
      //   ].question;
      // const questionMax = clone.getElementById("question-max");
      // questionMax.textContent = `${
      //   quizzesObj[subjectHeader.dataset.subject].questions.length
      // }`;
      // contentArea.replaceChildren(clone);
    }
  },
  true
);
