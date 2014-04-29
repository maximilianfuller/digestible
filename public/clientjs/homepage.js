$(document).ready(function() { 

  $(".signUp").click(function(){
    window.location = "/signUp.html";//needs to be changed when we move to digestable.io***
    //window.location.href = "http://digestable.io/signUp";
  });

  $("#authForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();
    //send data to the server
    $.post("log_in",{
       email: $('#authEmail').val(), 
       pass: $('#authPass').val(),
    },function(data,status){
      if(data === "invalid password"){
        alert("invalid email or password"); //don't specify which for security reasons
      }
      else if(data === "invalid email"){
        alert("invalid email or password");
      }
      else{
        //successful login, redirect to creator page
        window.location = "/home"; 
      }
    });
  });
});