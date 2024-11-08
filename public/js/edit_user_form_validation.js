(function () {
  let firstName = document.getElementById('firstName')
  let lastName = document.getElementById('lastName')
  let email = document.getElementById('email')
  const editUserForm = document.getElementById('edit-user-form')

  if (editUserForm) {
    editUserForm.addEventListener('submit', event => {
      errors = []

      // try {
      //   validations.checkString(firstName.value, 'First Name')
      // } catch (e) {
      //   errors.push(e)
      // }
      // try {
      //   validations.checkString(lastName.value, 'Last Name')
      // } catch (e) {
      //   errors.push(e)
      // }
      // try {
      //   validations.checkEmail(email.value, 'Email')
      // } catch (e) {
      //   errors.push(e)
      // }

      console.log('submission')

      if (errors.length > 0) {
        let myUL = document.createElement('ul')

        event.preventDefault()
        for (let i = 0; i < errors.length; i++) {
          let myLi = document.createElement('li')
          myLi.classList.add('error')
          myLi.innerHTML = errors[i]
          myUL.appendChild(myLi)
        }
        editUserForm.appendChild(myUL)
      }
    })
  }
})()
