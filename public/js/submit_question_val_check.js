function checkString (strVal, varName) {
  if (!strVal) {
    throw new Error(`Error: You must supply a ${varName}!`)
  }
  if (typeof strVal !== 'string') {
    throw new Error(`Error: ${varName} must be a string!`)
  }
  strVal = strVal.trim()
  if (strVal.length === 0) {
    throw new Error(
      `Error: ${varName} cannot be an empty string or string with just spaces`
    )
  }
  if (!isNaN(strVal)) {
    throw new Error(
      `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
    )
  }
  return strVal
};

let myForm = document.getElementById("createQuestionForm");

if (myForm) {
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();

    try {
      let questionInput = document.getElementById("user_question_input");
    let questionRole = document.getElementById("user_question_role");
    let questionDifficulty = document.getElementById("user_question_diff");
    let questionCompany = document.getElementById("user_question_company");
    let questionLocation = document.getElementById("user_question_location");
    let questionExperience = document.getElementById("user_question_experience");
    let questionType = document.getElementById("user_question_type");
    let questionCategory = document.getElementById("user_question_category");
    
    
    //validate all inputs
    checkString(questionInput, "User Question");
    checkString(questionRole, "Question Role");
    checkString(questionDifficulty , "Question Difficulty");
    checkString(questionCompany, "Question Company");
    checkString(questionLocation, "Question Location");
    checkString(questionExperience, "Question Experience");
    checkString(questionType, "Question Type");
    checkString(questionCategory, "Question Category");

    if (!questionInput || !questionRole || !questionDifficulty || !questionCompany || !questionLocation || !questionExperience || !questionType || !questionCategory) 
    {
      let errorDiv = document.createElement("div");
      errorDiv.classList.add("error-div");
      errorDiv.textContent = "ERROR User Update Fail";
      document.getElementById("error-div").appendChild(errorDiv);
    }
    } catch (error) {
      let errorDiv = document.createElement("div");
      errorDiv.classList.add("error-div");
      errorDiv.textContent = error;
      document.getElementById("error-div").appendChild(errorDiv);
    }
    




  });
}
