const choices = document.getElementById("subjects-form");
const subjectHeader = document.querySelector(".subject-heading-container");
const questionTemplate = document.getElementById("question-template");
const contentArea = document.getElementById("content-area");

const dataResponse = await fetch("data.json");
const data = await dataResponse.json();
const quizzes = data["quizzes"];
const quizzesObj = {};
for (const quiz of quizzes) {
  quizzesObj[quiz["title"]] = quiz;
}
console.log(quizzesObj);
const subjects = {
  js: "Javascript",
  html: "HTML",
  css: "CSS",
  accessibility: "Accessibility",
};
let questionCount = 1;
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

      // Question Template
      const clone = questionTemplate.content.cloneNode(true);
      contentArea.replaceChildren(clone);
    }
  },
  true
);
