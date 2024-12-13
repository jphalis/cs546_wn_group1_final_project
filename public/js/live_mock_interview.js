function checkString(strVal, varName) {
  if (!strVal) {
    throw new Error(`Error: You must supply a ${varName}!`);
  }
  if (typeof strVal !== "string") {
    throw new Error(`Error: ${varName} must be a string!`);
  }
  strVal = strVal.trim();
  if (strVal.length === 0) {
    throw new Error(
      `Error: ${varName} cannot be an empty string or string with just spaces`
    );
  }
  if (!isNaN(strVal)) {
    throw new Error(
      `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
    );
  }
  return strVal;
}

function checkEmail(strVal, varName) {
  strVal = this.checkString(strVal, varName);
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(strVal)) {
    throw new Error("Error: Invalid email format");
  }
  return strVal.toLowerCase();
}

let mockInterviewForm = document.getElementById("mockInterviewForm");

if (mockInterviewForm) {
  mockInterviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();
    let LastName = document.getElementById("LastName").value.trim();
    let email = document.getElementById("email").value.trim();
    let interviewType = document.getElementById("interviewType").value.trim();
    let date = document.getElementById("date").value.trim();
    let time = document.getElementById("time").value.trim();

    //check for errors
    checkString(firstName, "First Name");
    checkString(LastName, "Last Name");
    checkEmail(email, "Email");
    checkString(interviewType, "Interview Type");
    checkString(date, "Date");
    checkString(time, "Time");

    if (firstName && LastName && email && interviewType && date && time) {
      //set up AJAX request config
      let requestConfig = {
        method: "POST",
        url: "/createQuestion/interviewQuestion",
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
          errorDiv.classList.add("error-div");
          errorDiv.textContent = "ERROR User Update Fail";
          document.getElementById("error-div").appendChild(errorDiv);
        }
      });
    } else {
      let errorDiv = document.createElement("div");
      errorDiv.classList.add("error-div");
      errorDiv.textContent = "ERROR User Update Fail";
      document.getElementById("error-div").appendChild(errorDiv);
    }
  });
}
