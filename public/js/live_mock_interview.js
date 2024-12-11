(function ($) {
    // Let's start writing AJAX calls!
  
    //Let's get references to our form elements and the div where the todo's will go
    let myNewTaskForm = $('#new-item-form'),
      newNameInput = $('#new-task-name'),
      newDecriptionArea = $('#new-task-description'),
      todoArea = $('#todo-area');
  

  
    //new todo form submission event
    myNewTaskForm.submit(function (event) {
      event.preventDefault();
  
      let newName = newNameInput.val();
      let newDescription = newDecriptionArea.val();
  
      if (newName && newDescription) {
        //set up AJAX request config
        let requestConfig = {
          method: 'POST',
          url: '/api/todo.html',
          contentType: 'application/json',
          data: JSON.stringify({
            name: newName,
            description: newDescription
          })
        };
        //AJAX Call. Gets the returned HTML data, binds the click event to the link and appends the new todo to the page
        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          let newElement = $(responseMessage);
          bindEventsToTodoItem(newElement);
          todoArea.append(newElement);
          newNameInput.val('');
          newDecriptionArea.val('');
          newNameInput.focus();
        });
      }
    });
  })(window.jQuery);