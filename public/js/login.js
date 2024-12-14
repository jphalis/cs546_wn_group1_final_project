// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

;(function () {
  const signinForm = document.getElementById('signin-form')
  let email = document.getElementById('email')
  let password = document.getElementById('password')

  const signupForm = document.getElementById('signup-form')
  let firstName = document.getElementById('firstName')
  let lastName = document.getElementById('lastName')
  let phoneNumber = document.getElementById('phoneNumber')
  let bio = document.getElementById('bio')

  let errors = []

  if (signinForm) {
    signinForm.addEventListener('submit', event => {
      if (!userId.value.trim()) {
        errors.push('Email is required.')
      }
      if (!password.value.trim()) {
        errors.push('Password is required.')
      }
    })
  }

  if (signupForm) {
    signupForm.addEventListener('submit', event => {
      if (!firstName.value.trim()) {
        errors.push('First name is required.')
      }
      if (!lastName.value.trim()) {
        errors.push('Last name is required.')
      }
      if (!email.value.trim()) {
        errors.push('Email is required.')
      }
      if (!password.value.trim()) {
        errors.push('Password is required.')
      }
      if (!phoneNumber.value.trim()) {
        errors.push('Phone number is required.')
      }
      if (!bio.value.trim()) {
        errors.push('Bio is required.')
      }
    })
  }

  if (errors.length > 0) {
    event.preventDefault()
    let errorList = document.createElement('ul')
    errorList.classList.add('error-list')
    errors.forEach(error => {
      let errorItem = document.createElement('li')
      errorItem.textContent = error
      errorList.appendChild(errorItem)
    })
    editUserForm.appendChild(errorList)
  }
})()
