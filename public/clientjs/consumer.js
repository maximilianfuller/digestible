$(document).ready(function() { 
  alert("script calleddd");

  var meta = document.querySelector('meta[name=collectionName]');
  var collectionName = meta.content;
  alert(collectionName);

  $("#consumerForm").submit(function( event ) {
      
    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    $.post("subscribeRequest",
    {
       name: $('#name').val(), 
       email: $('#email').val(), 
       collection_id: collectionName
    },
    function(data,status){ 
        //messages = JSON.parse(data);
    });
  });
});