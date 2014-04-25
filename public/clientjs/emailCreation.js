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


  //populate the subject
  var subject = document.querySelector('meta[name=subject]').content;
 if(subject != ""){
    $('#emailTitleInput').val(subject);  
 }



  //Pete's stuff
  $('#deleteColl').click(function() {
    $('#deleteOverlay').show();
  });
  $('#cancelDelete, #finalDelete').click(function() {
    $('#deleteOverlay').hide();
  });
  $('#articleLinkInput').on('input', function() {
    if ($(this).val().length == 0) {
      $(this).css('width', '420px');
      $('#pullContent').css('display','none');
    } else {
      $(this).css('width', '390px');
      $('#pullContent').css('display','inline-block');
    }
  });
});