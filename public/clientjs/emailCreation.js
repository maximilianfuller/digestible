alert("adf");

$(document).ready(function() {
  
  var editor = new MediumEditor('.editable');

  //save the email to the database
  $('#saveColl').click(function() {
   $.post("save",{
       title: $('#emailTitleInput').val(),
       email: editor.serialize() 
    },function(data,status){
      if(data === "success"){
        alert("successfully saved email");
      }
      else if(data === "invalid_email"){
        alert("error");
      }
    });
  });


  //Pete's stuff
  $('#deleteColl').click(function() {
    $('#deleteOverlay').show();
  });
  $('#cancelDelete, #finalDelete').click(function() {
    $('#deleteOverlay').hide();
  });

});