import validations from '../validations.js'
import questionData from '../../data/questions.js'

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
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    let userQuestion = validations.checkString(questionInput, 'User Question');
    let userQuestionRole = validations.checkString(questionRole, 'Role Question');
    let userQuestionDifficulty = validations.checkString(questionDifficulty, 'Difficulty Question');
    let userQuestionCompany = validations.checkString(questionCompany, 'Company Question');
    let userQuestionLocation = validations.checkString(questionLocation, 'Location Question');
    let userQuestionExperience = validations.checkString(questionExperience, 'Experience Question');
    let userQuestionType = validations.checkStringArray(questionType, 'Type Question');
    let userQuestionCategory = validations.checkStringArray(questionCategory, 'Category Question');

    //call AI gen for answer
    let aiAnswer = "";
        
    
    //after complete save it to DB 
    let newQuestion = questionData.createNewQuestion(
      userQuestion,
      aiAnswer,
      userQuestionRole,
      userQuestionDifficulty,
      userQuestionCompany,
      userQuestionLocation,
      userQuestionExperience,
      userQuestionType,
      userQuestionCategory
    );


    //show submission on question


  });
}