$(document).ready(function() { 
     alert("aweffffff");
  $("#consumerForm").submit(function( event ) {
       
    // prevent the page from redirecting
    event.preventDefault();
    alert("asdf");
    //send data to the server
    $.post("consumer",
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

/*//overrides default behavior of messageForm
window.addEventListener('load', function(){
   alert("awefa");
    var messageForm = document.getElementById('signForm');
    messageForm.addEventListener('submit', sendForm, false);
}, false);*/