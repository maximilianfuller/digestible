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
    window.location = "/home";
  });

  $('#goBack').click(function() {
    window.location = "/home";
  });


  
  //can only edit content when the collection is not published
  if(meta("visible") == "true") {
    $('#deleteColl').hide();
    $('#saveColl').hide();
    //TODO: set content to non-editableboss.
  }

  function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
  }

 //pulls content
 $('#pullContent').click(function(){
   $.post("ajax/scrapeUrl",{
       url: $('#articleLinkInput').val(),
    },function(data,status){
      if(data.content == "invalid url"){
        alert("invalid url");
      }
      else{
        $('#emailInput').html(data.content);
        $.post("/ajax/editEntry",{
           subject: $('#emailTitleInput').val(),
           content: data.content,
           entry_id: meta("entryId")
        });
        $('#emailInput').focus();
        $('#mainWrap').focus();
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