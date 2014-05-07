
$(document).ready(function() { 
  $("#successMessage").hide();
  var metaN = document.querySelector('meta[name=collectionName]');
  var collectionName = metaN.content;

  var metaI = document.querySelector('meta[name=collectionId]');
  var collectionId = metaI.content;

  $("#consumerForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    $.post("sign_up",{
       name: $('#name').val(), 
       email: $('#email').val(), 
       collection_id: collectionId,
       collection_name: collectionName
    },function(data,status){
      if(status === "success"){
        $("#subscribeNote").slideDown();
        $("#consumerForm").hide();
        $("#emailExplain").hide("fast", function(){
          $("#successMessage").show();
        });
      }
    });
  });
});