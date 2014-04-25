$(document).ready(function() {



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

  $('#addEmailWrap').mousedown(function() {
    $(this).css('border', '2px solid #aaa');
  });
  $('#addEmailWrap').mouseup(function() {
    $(this).css('border', '2px solid #ccc');
  });
  $('#addEmailWrap').mouseleave(function() {
    $(this).css('border', '2px solid #ccc');
  });
});