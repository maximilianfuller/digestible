function sendMessage(e) {

    var emptyFields = "false"; //check if the form has been filled out
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

}

//overrides default behavior of messageForm
window.addEventListener('load', function(){
    var messageForm = document.getElementById('signForm');
    messageForm.addEventListener('submit', sendMessage, false);
}, false);
