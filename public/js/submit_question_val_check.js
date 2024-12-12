

let myForm = document.getElementById("createQuestionForm");


if (myForm) {
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("CLIENT SIDEEE");
    let questionInput = document.getElementById("user_question_input");
let questionRole = document.getElementById("user_question_role");
let questionDifficulty = document.getElementById("user_question_diff");
let questionCompany = document.getElementById("user_question_company");
let questionLocation = document.getElementById("user_question_location");
let questionExperience = document.getElementById("user_question_experience");
let questionType = document.getElementById("user_question_type");
let questionCategory = document.getElementById("user_question_category");
    //validate all inputs

    

  });
}