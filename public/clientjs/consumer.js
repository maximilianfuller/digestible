$(document).ready(function() { 
  $("#successMessage").hide();
  var meta = document.querySelector('meta[name=collectionName]');
  var collectionName = meta.content;

  $("#consumerForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    $.post("sign_up",{
       name: $('#name').val(), 
       email: $('#email').val(), 
       collection_id: collectionName
    },function(data,status){
      if(status === "success"){
        $("#consumerForm").hide();
        $("#emailExplain").hide("fast", function(){
          $("#successMessage").show();
        });
      }
    });
  });
});