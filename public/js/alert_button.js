const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

const form = document.getElementById('reportForm')
const fieldToCheck = document.getElementById('reportReason')
const submitButton = document.getElementById('reportAlertButton')

submitButton.addEventListener('click', () => {
  if (fieldToCheck.value.trim() !== '') {
    appendAlert(
      'Your report has been submitted! We will review this.',
      'success'
    )
  } else {
    appendAlert(
      'Please fill out the required field before submitting.',
      'warning'
    )
  }
})
