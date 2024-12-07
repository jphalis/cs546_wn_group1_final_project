let myForm = document.getElementById('loginForm');
let userName = document.getElementById('username');
let password = document.getElementById('password');
let errorDiv = document.getElementById('error');
let myUl = document.getElementById('loginPage');
let frmLabel = document.getElementById('formLabel');
if (myForm) {
  myForm.addEventListener('submit', async (event) => {
    try{
    console.log('Form submission fired');
    event.preventDefault();
    console.log('Has a form');
    if (inputValidation(userName, password)) {
        const formData = {
            userName: userName.value,
            password: password.value
          };
        await populateUserPage(formData);
        } else {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a value';
      frmLabel.className = 'error';
      input.focus();
    }
}
catch(e){
    if(e instanceof RangeError){
        alert("OUT OF BOUNDS - REDUCE INPUT VALUE");
    }
}
});
}

function inputValidation(userName, password){
    if(userName.value.trim() && password.value.trim()) {
        return true; 
    } else {
        return false;
    }
}

async function populateUserPage(formData) {
    console.log(`HERE IS THE FORM DATA: ${JSON.stringify(formData)}`);
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        redirect: "follow"
      });
  
      if (response.ok) {
       //const data = await response.json();
        //console.log("Login successful:", data);
        console.log("redirect is not happening");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
        console.error('Error:', error);
        console.error('Stack Trace:', error.stack); 
      }
      
  }
  