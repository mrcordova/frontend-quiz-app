const choices = document.getElementById("subjects-form");
const subjectHeader = document.querySelector(".subject-heading-container");

const subjects = {
  js: "Javascript",
  html: "HTML",
  css: "CSS",
  accessibility: "Accessibility",
};
choices.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    const val = e.target.closest("label")?.dataset.value;

    if (val != undefined) {
      //   console.log(val);
      const img = subjectHeader.children[0];
      img.setAttribute("src", `assets/images/icon-${val}.svg`);
      img.setAttribute("alt", val);
      img.classList.toggle("hide", false);

      const headerText = subjectHeader.children[1];
      headerText.textContent = subjects[val];
    }
  },
  true
);
