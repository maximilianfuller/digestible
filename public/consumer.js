$(document).ready(function() { 
  $("#consumerForm").submit(function( event ) {
       
    // prevent the page from redirecting
    event.preventDefault();
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