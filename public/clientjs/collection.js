$(document).ready(function() {


  /*
  *Pete's stuff
  */
  if ($('#subscriptionsContainer ol').html().length > 0) {
    $('#noLinksPrompt').hide();
  }

  $('#settingsHolder').click(function() {
    $('#collSettingsOverlay').show();
  });
  $('#collOptionsForm .formSubmit').click(function() {
    $('#collSettingsOverlay').hide();
  });

  $('#collEditForm .formSubmit').click(function() {
    alert("This is just an example of what the the sign up form looks like for your readers.");
  });

  $('#deleteColl').click(function() {
    $('#deleteOverlay').show();
  });
  $('#cancelDelete, #finalDelete').click(function() {
    $('#deleteOverlay').hide();
  });
  /*
  *end of Pete's stuff
  */

  //MAX'S STUFF

function getCollectionData(collectionID)
$.get("collection/" + meta("creatorEmail") + "/ajax/" + collectionID function(data) {
  $("$collTitleInput").val(data.collection_title);
  $("#author").val(data.collection_author);
  $("#collDescriptInput").val(data.collection_description);

  var $ol = $("$subscriptionsContainer ol");
  $ol.empty();
  for(var i = 0; i < data.entries.length; i++) {
    $ol.append(
      $("<li>").append(
        $("<a>").attr('href', "/collection/" + meta(email) + 
          "/" + data.entries[i].entry_id).html(data.entries[i].title);
    ));
  }
});

function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}


  //END OF MAX'S STUFF






  //BEN'S STUFF









  //END OF BEN'S STUFF



});