
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

    if (firstName && LastName && email && interviewType && date && time) {
      //set up AJAX request config
      let requestConfig = {
        method: "POST",
        url: "/createQuestion/interviewQ",
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
      //AJAX Call. Gets the returned HTML data, binds the click event to the link and appends the new todo to the page
      $.ajax(requestConfig).then(function (responseMessage) {
        // Redirect to the new route
        if(responseMessage)
        {
          window.location.href = '/createQuestion/thankYouSubmission';
        }
        else
        {
          let errorDiv = document.createElement('div'); 
          errorDiv.classList.add('error-div'); 
          errorDiv.textContent = 'ERROR User Update Fail'; 
          document.getElementById('error-div').appendChild(errorDiv);
        }
        
      });
    }
  });
}
