function checkString(strVal, varName) {
  if (!strVal) {
    throw new Error(`You must supply a ${varName}!`);
  }
  if (typeof strVal !== "string") {
    throw new Error(`${varName} must be a string!`);
  }
  strVal = strVal.trim();
  if (strVal.length === 0) {
    throw new Error(
      `${varName} cannot be an empty string or string with just spaces`
    );
  }
  if (!isNaN(strVal)) {
    throw new Error(
      `${strVal} is not a valid value for ${varName} as it only contains digits`
    );
  }
  return strVal;
};

function checkInt(intVal, varName) {
  if (intVal === undefined || intVal === null) {
    throw new Error(`Error: You must supply a ${varName}!`);
  }

  // If the input is not a number or cannot be converted to one
  if (typeof intVal === "string") {
    intVal = intVal.trim(); // Remove extra spaces
    if (!/^-?\d+$/.test(intVal)) { // Check if it's an integer-like string
      throw new Error(`Error: ${varName} must be a valid integer!`);
    }
    intVal = parseInt(intVal, 10); // Convert the valid string to an integer
  }

  if (typeof intVal !== "number" || !Number.isInteger(intVal)) {
    throw new Error(`Error: ${varName} must be a valid integer!`);
  }

  return intVal;
};

function checkUserQuestion(
  questionInput,
  questionRole,
  questionDifficulty,
  questionCompany,
  questionLocation,
  questionExperience,
  questionType,
  questionCategory) 
  {
  let validQuestion = false;
  questionInput = checkString(questionInput, "User Question");
  questionRole = checkString(questionRole, "Question Role");
  questionDifficulty = checkString(questionDifficulty, "Question Difficulty");
  questionCompany = checkString(questionCompany, "Question Company");
  questionLocation = checkString(questionLocation, "Question Location");
  questionExperience = checkInt(questionExperience, "Question Experience");
  questionType = checkString(questionType, "Question Type");
  questionCategory = checkString(questionCategory, "Question Category");

  if (
    questionInput &&
    questionRole &&
    questionDifficulty &&
    questionCompany &&
    questionLocation &&
    questionExperience &&
    questionType &&
    questionCategory
  ) {
    validQuestion = true;
  }

  return validQuestion;
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
      let validInput = checkUserQuestion(
        questionInput,
        questionRole,
        questionDifficulty,
        questionCompany,
        questionLocation,
        questionExperience,
        questionType,
        questionCategory
      );

      if (!validInput) {
        let errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.textContent = "ERROR User Update Fail";
        document.getElementById("error-div").appendChild(errorDiv);
      }
        
    } catch (error) {
      let errorDiv = document.createElement("div");
      errorDiv.classList.add("error");
      errorDiv.textContent = error;
      document.getElementById("error-div").appendChild(errorDiv);
    }
  });
}
