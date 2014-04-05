$(document).ready(function() { 
     alert("awefff");
  $("form").submit(function( event ) {
       
    // prevent the page from redirecting
    event.preventDefault();
  
    alert($('#name').val());
    alert($('#email').val());

    //send data to the server
    $.post(("consumer"),
    {
       name: $('#name').val(), 
       email: $('#email').val()
    },
    function(data,status){ //
        messages = JSON.parse(data);
        displayMessages(messages);
    });
  });
});

//overrides default behavior of messageForm
window.addEventListener('load', function(){
   alert("awefa");
   /* var messageForm = document.getElementById('signForm');
    messageForm.addEventListener('submit', sendForm, false);*/
}, false);