$(document).ready(function() { 
  $("form").submit(function( event ) {
    event.preventDefault();
        // prevent the page from redirecting
    e.preventDefault();

    // create a FormData object from our form
    var fd = $('#messageField').val();
    $('#messageField').val('');

    $.post((roomName + "/messages.json"),
    {
       sendMessage: "true",
       rName: roomName, 
       nName: nickName,
       mess: fd
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


