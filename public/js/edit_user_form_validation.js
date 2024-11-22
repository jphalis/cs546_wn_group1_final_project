;(function () {
  let firstName = document.getElementById('firstName')
  let lastName = document.getElementById('lastName')
  let email = document.getElementById('email')
  let oldPassword = document.getElementById('password')
  let newPassword = document.getElementById('newPassword')
  let confirmPassword = document.getElementById('confirmPassword')
  const editUserForm = document.getElementById('edit-user-form')

  if (editUserForm) {
    editUserForm.addEventListener('submit', event => {
      errors = []

      if (!firstName.value.trim()) {
        errors.push('First Name is required.')
      }
      if (!lastName.value.trim()) {
        errors.push('Last Name is required.')
      }
      if (!email.value.trim()) {
        errors.push('Email is required.')
      } else if (!isValidEmail(email.value)) {
        errors.push('Invalid email format.')
      }
      if (!oldPassword.value.trim()) {
        errors.push('Your old password is required.')
      }
      if (
        (newPassword.value && !confirmPassword.value) ||
        (!newPassword.value && confirmPassword.value)
      ) {
        errors.push('Confirm your new password')
      }
      if (newPassword.value && confirmPassword.value) {
        if (newPassword.value !== confirmPassword.value) {
          errors.push('Your passwords do not match.')
        }
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
      } else {
        console.log('Form submitted successfully!')
      }
    })
  }

  function isValidEmail (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
})()
