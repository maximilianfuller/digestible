$(document).ready(function() {


  /*
  *Pete's stuff
  */

  if($("#collections").val() == null) {
    $('#deleteColl').hide();
  }

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
  $('#addEmailWrap').mousedown(function() {
    $(this).css('border', '2px solid #aaa');
  });
  $('#addEmailWrap').mouseup(function() {
    $(this).css('border', '2px solid #ccc');
  });
  $('#addEmailWrap').mouseleave(function() {
    $(this).css('border', '2px solid #ccc');
  });
  /*
  *end of Pete's stuff
  */

  //MAX'S STUFF

//get data from server
var currentCollectionId = $("#collections").val();
if(currentCollectionId == null) {
  //what do we do when the creator has no collections?
} else {
  getCollectionData(currentCollectionId);
}

//change data upon selecting a new collection
$("#collections").on("change", function() {
  getCollectionData($("#collections").val());
});

$("#publishColl").click(function() {
  var collection_id = $("#collections").val()
  var collection = {
    collection_id: collection_id,
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: "true"
  }
  postCollectionData(collection);

});

$("#finalDelete").click(function() {
  deleteCollection($("#collections").val());
});



//gets collection data from the server
function getCollectionData(collectionId) {
  $.get("/ajax/" + collectionId, function(data) {
    $("#collTitleInput").val(data.collection_title);
    $("#author").val(data.creator_name);
    $("#collDescriptInput").val(data.collection_description);

    var $ol = $("#subscriptionsContainer ol");
    $ol.empty();
    for(var i = 0; i < data.entries.length; i++) {
      $ol.append(
        $("<li>").append(
          $("<a>").attr('href', "/" + data.entries[i].entry_id).html(data.entries[i].title)
      ));
    }
    if ($('#subscriptionsContainer ol').html().length > 0) {
      $('#noLinksPrompt').hide();
    } else {
      $('#noLinksPrompt').show();
    }
  });

}

//edits collection data on the server
function postCollectionData(collection) {
  $.post("/ajax/editCollection", collection, function(data) {
    getCollectionData(collection.collection_id);
  })
    .fail(function() {
      alert("error");
    });
}

//deletes the collection on the server
function deleteCollection(collectionId) {
  $.post("/ajax/deleteCollection", {collection_id : collectionId}, function(data) {
    alert("deleting collection");
    location.reload(true);
  });
}

//creates a collection on the server
function createCollection() {
  $.post("/ajax/createCollection", function(data) {
    //refresh page
    location.reload(true);
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