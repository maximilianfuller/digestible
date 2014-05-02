$(document).ready(function() {
  
  var editor = new MediumEditor('.editable', {
    buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 
    'quote', 'unorderedlist', 'orderedlist'],
    firstHeader:'h1',
    secondHeader:'h2'
  });
  //save the email to the database
  $('#saveColl').click(function() {
    var html = editor.serialize().emailInput.value;
    html += "<h1>HEADER hi</h1>";
   $.post("/ajax/editEntry",{
       subject: $('#emailTitleInput').val(),
       content: html,
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

 //pulls content
 $('#pullContent').click(function(){
   $.post("scrape",{
       url: $('#articleLinkInput').val(),
    },function(data,status){
      alert("asdf");
      alert(data);
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