$(document).ready(function() { 
  alert("script called");

  var meta = document.querySelector('meta[name=collectionName]');
  var collectionName = meta.content;
  alert(collectionName);

  $("#consumerForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    alert("here");
     $.post("endpoint",
        {
            refreshMessages: "true",
            rName: roomName
        }).done(
        function(data){
            messages = JSON.parse(data);
            displayMessages(messages);
        });

/*
    $.post(("subscribeRequest"),
    {
       name: $('#name').val(), 
       email: $('#email').val(), 
       collection_id: collectionName
    },
    function(data,status){ 
            alert("asdf");
    });*/
  });
});