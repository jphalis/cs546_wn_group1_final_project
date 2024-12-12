
    // Let's start writing AJAX calls!
    //Let's get references to our form elements and the div where the todo's will go
    let mockInterviewForm = document.getElementById('mockInterviewForm'),
    firstName = document.getElementById('firstName'),
    LastName = document.getElementById('LastName'),
    email = document.getElementById('email'),
    interviewType = document.getElementById('interviewType'),
    date = document.getElementById('date'),
    time = document.getElementById('time');
  

  
    //new todo form submission event
    if (mockInterviewForm) {
      mockInterviewForm.addEventListener("submit",  (event) => {
        event.preventDefault();
        console.log("CLIENT SIDEEE");
      console.log("INSIDE CLIENT JS");
      //check for errors 

      if (firstName && 
        LastName &&
        email &&
        interviewType &&
        date && 
        time) {
        //set up AJAX request config
        let requestConfig = {
          method: 'POST',
          url: '/interviewQ',
          contentType: 'application/json',
          data: JSON.stringify({
            firstName: firstName,
            LastName: LastName,
            email: email,
            interviewType: interviewType, 
            date: date,
            time: time
          })
        };
        //AJAX Call. Gets the returned HTML data, binds the click event to the link and appends the new todo to the page
        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          
        });
      }
    });
  }