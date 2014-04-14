$(document).ready(function() { 

  $("#authForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    $.post("log_in",{
       email: $('#authEmail').val(), 
       pass: $('#authPass').val() 
    },function(data,status){
      if(data === "invalid_pass"){
        alert("invalid password");
      }
      else if(data === "invalid_email"){
        alert("invalid email");
      }
      else{
        //successful login, redirect to creator page
        //alert(data);
        window.location.href = "http://localhost:8080/collection/" + $('#authEmail').val(); 
      }
    });
  });
});