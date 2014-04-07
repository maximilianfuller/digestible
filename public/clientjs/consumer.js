$(document).ready(function() { 
  alert("script calffled");

  var meta = document.querySelector('meta[name=collectionName]');
  var collectionName = meta.content;
  alert(collectionName);

  $("#consumerForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    $.post("sign_up",{
       name: $('#name').val(), 
       email: $('#email').val(), 
       collection_id: collectionName
    },function(data,status){
      alert("Data: " + data + "\nStatus: " + status);
    });
  });
});