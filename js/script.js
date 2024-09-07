const choices = document.getElementById("subjects-form");
const subjectHeader = document.querySelector(".subject-heading-container");
const questionTemplate = document.getElementById("question-template");
const quizCompleteTemplate = document.getElementById("quiz-complete");
const contentArea = document.getElementById("content-area");
const toggle = document.querySelector("label[for='toggle']");
const toggleInput = toggle.querySelector("#toggle");
const dataResponse = await fetch("data.json");
const data = await dataResponse.json();
const quizzes = data["quizzes"];
const quizzesObj = {};
let questionCount = 0;
let currentScore = 0;
let userChoiceLabel;
let firstPage;

for (const quiz of quizzes) {
  quizzesObj[quiz["title"]] = quiz;
}
const subjects = {
  js: "JavaScript",
  html: "HTML",
  css: "CSS",
  accessibility: "Accessibility",
};

function keyboardClick(e) {
  if (e.key == " " && e.target.tagName == "LABEL") {
    const input = e.target.querySelector("input");
    input.checked = !input.checked;
    e.target.click();
  } else if (e.key == " " && e.target.tagName == "BUTTON") {
  }
}

function checkAnswer(e) {
  const choiceLabel = e.target.closest("label");
  const eleTagName = e.target.tagName;
  if (choiceLabel) {
    const choiceInput = choiceLabel.querySelector("input[type='radio'");
    choiceInput.checked = true;
    userChoiceLabel = choiceLabel;
  } else if (eleTagName === "BUTTON" && userChoiceLabel == undefined) {
    e.preventDefault();
    document.getElementById("no-answer").classList.toggle("hide", false);
  } else if (eleTagName === "BUTTON") {
    e.preventDefault();

    const answer =
      quizzesObj[subjectHeader.dataset.subject].questions[questionCount].answer;
    const answerLabel = document.querySelector(
      `label[data-choice="${answer}"]`
    );
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
      e.target.focus();
      e.target.parentElement.removeEventListener("click", checkAnswer, true);
      e.target.parentElement.removeEventListener("keyup", keyboardClick, true);

      e.target.addEventListener("mouseup", nextPage);
      e.target.addEventListener("keyup", (ev) => {
        if (ev.key == " ") {
          nextPage(ev);
        }
      });

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
      e.target.focus();
      e.target.parentElement.removeEventListener("click", checkAnswer, true);
      e.target.parentElement.removeEventListener("keyup", keyboardClick, true);

      e.target.addEventListener("mouseup", nextPage);
      e.target.addEventListener("keyup", (ev) => {
        if (ev.key == " ") {
          nextPage(ev);
        }
      });
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
    choiceForm.addEventListener("keyup", keyboardClick, true);
    userChoiceLabel = undefined;

    const question = clone.getElementById("question");
    question.textContent = subject.questions[questionCount].question;

    const questionMax = clone.getElementById("question-max");
    questionMax.textContent = `${subject.questions.length}`;

    const progress = clone.getElementById("progressbar");
    progress.setAttribute("value", questionCount + 1);

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

window.addEventListener("load", () => {
  let idx = 0;
  for (const quizObj of Object.values(quizzesObj)) {
    choices.children[idx].querySelector(
      "span"
    ).textContent = `${quizObj.title}`;
    const img = choices.children[idx].querySelector("img");
    img.setAttribute("src", `${quizObj.icon}`);
    img.setAttribute("alit", quizObj.title);
    idx++;
  }
});
toggle.addEventListener("click", (e) => {
  e.preventDefault();
  const input = e.currentTarget.querySelector("input");
  input.checked = !input.checked;
  document.documentElement.classList.toggle("light-mode");
});

toggle.addEventListener("keyup", (e) => {
  if (e.key == " ") {
    toggleInput.checked = !toggleInput.checked;
    toggleInput.click();
  }
});

choices.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    const label = e.target.closest("label");

    const val = label.dataset?.value;
    if (val != undefined) {
      const img = subjectHeader.children[0];
      subjectHeader.replaceChild(label.children[1].cloneNode(true), img);

      const headerText = subjectHeader.children[1];
      headerText.textContent = subjects[val];
      subjectHeader.dataset.subject = subjects[val];

      firstPage = [...contentArea.children];
      nextPage(e);
    }
  },
  true
);

choices.addEventListener("keyup", (e) => {
  if (e.key == " ") {
    e.target.click();
  }
});
