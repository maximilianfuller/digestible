$(document).ready(function() { 

  $("#signForm").submit(function( event ) {

    // prevent the page from redirecting
    event.preventDefault();

    //check if the form has been filled out
    var emptyFields = "false"; 
    $.each($('#signForm').serializeArray(), function() {             
        if(this.value === ""){
          emptyFields = "true";
        }    
    });

    if(emptyFields === "false"){ 
      //let the normal event execute
    }
    else{
      alert("please fill out all fields");
      // prevent the page from redirecting
      e.preventDefault();
    }

    //send data to the server
    $.post("sign_up",{
         name: $('#name').val(),
         email: $('#email').val(),
         password: $('#password').val(),
         id: $('#id').val(),
         street: $('#street').val(),
         city:$('#city').val(),
         state:$('#state').val(), 
         zip:$('#zip').val()
    },function(data,status){

      if(data === "success"){
        //login, redirect to creator page
        $.post("log_in",{
           email: $('#email').val(), 
           pass: $('#password').val(),
        },function(data,status){
          if(data === "invalid email" || data === "invalid password"){
            alert("server error"); 
          } else{
            //successful login, redirect to creator page
            window.location = "/home"; 
          }
        });
      }
    });
  });
});