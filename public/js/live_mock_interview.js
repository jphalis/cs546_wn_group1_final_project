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
}

function checkEmail(strVal, varName) {
  strVal = checkString(strVal, varName);
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(strVal)) {
    throw new Error("Invalid email format");
  }
  return strVal.toLowerCase();
}

function isValidInterviewType(input) {
  const validInterviewTypes = [
    "Screening",
    "Technical",
    "Behavioral",
    "Case Study",
    "Situational",
    "Competency-Based",
    "Stress"
  ];

  return validInterviewTypes.includes(input);
}

function checkDate(date,time){
  // Combine the date and time into a single string
  let dateTimeString = `${date}T${time}:00`;
    
  // Convert the string to a Date object
  let appointmentDate = new Date(dateTimeString);
  
  // Get the current date and time
  let currentDate = new Date();
  let dateCheck = false;
  // Check if the appointment date is valid
  if (!isNaN(appointmentDate)) {
      if (appointmentDate > currentDate) {
        dateCheck = true;
      } else {
        throw new Error("Date in the past");
      }
  } else {
    throw new Error("Not A Valid Date");
  }

  return dateCheck;
};

function checkMockInterview(firstName,LastName,email,interviewType,date,time)
{
  let allValidFields = true;
  firstName = checkString(firstName, "First Name");
  LastName = checkString(LastName, "Last Name");
  email = checkEmail(email, "Email");
  interviewType = checkString(interviewType, "Interview Type");
  date = checkString(date, "Date");
  time = checkString(time, "Time");

  let validInterviewType = isValidInterviewType(interviewType);

  if(!validInterviewType)
  {
    allValidFields = false;
    throw new Error("Interview Type Not Valid");
  }

  let validDate = checkDate(date,time);

  if(!validDate)
  {
    allValidFields = false; 
    throw new Error("Date Not Valid");
  }
  return allValidFields;
};

let mockInterviewForm = document.getElementById("mockInterviewForm");

if (mockInterviewForm) {
  mockInterviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    try {
      let firstName = document.getElementById("firstName").value.trim();
      let LastName = document.getElementById("LastName").value.trim();
      let email = document.getElementById("email").value.trim();
      let interviewType = document.getElementById("interviewType").value.trim();
      let date = document.getElementById("date").value.trim();
      let time = document.getElementById("time").value.trim();

      //check for errors
      let validInputs = checkMockInterview(firstName,LastName,email,interviewType,date,time);

      if (validInputs) {
        //set up AJAX request config
        let requestConfig = {
          method: "POST",
          url: "/users/interviewQuestion",
          contentType: "application/json",
          data: JSON.stringify({
            firstName: firstName,
            LastName: LastName,
            email: email,
            interviewType: interviewType,
            date: date,
            time: time,
          }),
        };
        //AJAX Call
        $.ajax(requestConfig).then(function (responseMessage) {
          // Redirect to the new route
          if (responseMessage) {
            window.location.href = "/users/thankYouSubmission";
          } else {
            let errorDiv = document.createElement("div");
            errorDiv.classList.add("error");
            errorDiv.textContent = "ERROR Adding Mock Interview Fail";
            document.getElementById("error-div").appendChild(errorDiv);
          }
        });
      } else {
        let errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.textContent = "ERROR Input Validation Fail";
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
