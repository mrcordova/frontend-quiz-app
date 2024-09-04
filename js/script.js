const choices = document.getElementById("subjects-form");

choices.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    const val = e.target.closest("label").dataset.value;
    console.log(val);
  },
  true
);
