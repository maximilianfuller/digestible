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

//get data from server
getCollectionData($("#collections").val());
//change data upon selecting a new collection
$("#collections").on("change", function() {
  getCollectionData($("#collections").val());
});

$("#publishColl").click(function() {
  var collection = {
    collection_id: $("#collections").val(),
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: "true"
  }
  postCollectionData(collection);
});

function getCollectionData(collectionId) {
  $.get("/collection/" + meta("creatorEmail") + "/ajax/" + collectionId, function(data) {
    $("#collTitleInput").val(data.collection_title);
    $("#author").val(data.creator_name);
    $("#collDescriptInput").val(data.collection_description);

    var $ol = $("#subscriptionsContainer ol");
    $ol.empty();
    for(var i = 0; i < data.entries.length; i++) {
      $ol.append(
        $("<li>").append(
          $("<a>").attr('href', "/collection/" + meta("creatorEmail") + "/" + data.entries[i].entry_id).html(data.entries[i].title)
      ));
    }
    if ($('#subscriptionsContainer ol').html().length > 0) {
      $('#noLinksPrompt').hide();
    } else {
      $('#noLinksPrompt').show();
    }
  });

}

function postCollectionData(collection) {
  $.post("/collection/" + meta("creatorEmail") + "/ajax", collection)
    .fail(function() {
      alert("error");
    });
}

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