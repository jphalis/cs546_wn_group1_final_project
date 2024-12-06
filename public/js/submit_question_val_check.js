

let myForm = document.getElementById("createQuestionForm");
let questionInput = document.getElementById("user_question_input");
let questionRole = document.getElementById("user_question_role");
let questionDifficulty = document.getElementById("user_question_diff");
let questionCompany = document.getElementById("user_question_company");
let questionLocation = document.getElementById("user_question_location");
let questionExperience = document.getElementById("user_question_experience");
let questionType = document.getElementById("user_question_type");
let questionCategory = document.getElementById("user_question_category");

if (myForm) {
  myForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("CLIENT SIDEEE");
    //validate all inputs

    //show submission on question
    //use JS like in lab 9 to add elements to the page

  });
}