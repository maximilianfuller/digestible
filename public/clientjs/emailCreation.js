$(document).ready(function() {
  
  var editor = new MediumEditor('.editable');
  //save the email to the database
  $('#saveColl').click(function() {
   $.post("/ajax/editEntry",{
       subject: $('#emailTitleInput').val(),
       content: editor.serialize().emailInput.value,
       entry_id: meta("entryId")
    });
  });

  $('#finalDelete').click(function() {
    $.post("ajax/deleteEntry", {entry_id: meta("entryId")});
    window.location = "/home"
  });

  $('#goBack').click(function() {
    window.location = "/home"
  });


  
  //can only edit content when the collection is not published
  if(meta("visible") == "true") {
    $('#deleteColl').hide();
    $('#saveColl').hide();
    //TODO: set content to non-editable
  }

  function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
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