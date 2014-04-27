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

  // Checks the hidden div #publishedKey, if html is no, then we are viewing an unpublished page
  // if html is yes, then we are viewing a published page and all of the button disappear and we see "Unpublish to Edit"
  if ($('#publishedKey').html() == 'no') {
    $('.headerButton, #settingsHolder').removeClass('published');
    $('.headerButton, #settingsHolder').addClass('unpublished');
  } else {
    $('.headerButton, #settingsHolder').removeClass('unpublished');
    $('.headerButton, #settingsHolder').addClass('published');
  }
  /*
  *end of Pete's stuff
  */

  //MAX'S STUFF
refresh();

//get data from server
function refresh() {
  var currentCollectionId = $("#collections").val();
  if(currentCollectionId == null) {
    //what do we do when the creator has no collections?
  } else {
    getCollectionData(currentCollectionId);
  }
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
  editCollectionData(collection);

});

$("#saveColl").click(function() {
  var collection_id = $("#collections").val()
  var collection = {
    collection_id: collection_id,
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: "false"
  }
  editCollectionData(collection);

});

$("#finalDelete").click(function() {
  deleteCollection($("#collections").val());
});

$("#addCollection").click(function() {
  createCollection();
});

$("#addEmailWrap").click(function() {
  alert("here");
  addEntry();
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
  })
    .fail(function() {
      alert("error");
    });

}

//edits collection data on the server
function editCollectionData(collection) {
  $.post("/ajax/editCollection", collection, function(data) {
    getCollectionData(collection.collection_id);
    //update sidebar
    $('#collections option[value="' + collection.collection_id + '"]')
      .html(collection.collection_title);
  })
    .fail(function() {
      alert("error");
    });
}

//deletes the collection on the server
function deleteCollection(collectionId) {
  $.post("/ajax/deleteCollection", {collection_id : collectionId}, function(data) {
    $('#collections option[value="' + collectionId + '"]').remove();
    refresh();
  })
    .fail(function() {
      alert("error");
    });
}

//creates a collection on the server
function createCollection() {
  $.post("/ajax/createCollection", function(data) {
    //refresh page
    var $option = $('<option>').val(data.collection_id).html(data.collection_title);
    $('#collections').append($option);
    $option.attr("selected", true);
    refresh();
  })
    .fail(function() {
      alert("error");
    });
}

function addEntry() {
  $.post("/ajax/createEntry", function(data) {
    window.location = "/" + data.entry_id;
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