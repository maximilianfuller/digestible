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
refresh();

//get data from server and adjust the page accordingly
function refresh() {
  var currentCollectionId = $("#collections").val();
  if(currentCollectionId == null) {
    //what do we do when the creator has no collections?
  } else {
    $.get("/ajax/" + currentCollectionId, function(data) {
      $("#collTitleInput").val(data.collection_title);
      $("#author").val(data.creator_name);
      $("#collDescriptInput").val(data.collection_description);

      var $ol = $("#subscriptionsContainer ol");
      $ol.empty();
      var entries = data.entries.sort(function(a, b) {
        return a.entry_number - b.entry_number;
      });
      for(var i = 0; i < entries.length; i++) {
        $ol.append(
          $("<li>").append(
            $("<a>").attr('href', "/" + entries[i].entry_id).html(entries[i].subject + " " + entries[i].entry_number)
        ));
      }
      if ($('#subscriptionsContainer ol').html().length > 0) {
        $('#noLinksPrompt').hide();
      } else {
        $('#noLinksPrompt').show();
      }
      if (data.visible == 'false') {
        $('.headerButton, #settingsHolder').removeClass('published');
        $('.headerButton, #settingsHolder').addClass('unpublished');
      } else {
        $('.headerButton, #settingsHolder').removeClass('unpublished');
        $('.headerButton, #settingsHolder').addClass('published');
      }
    })
      .fail(function() {
        alert("error");
      });
  }
  
}

//change data upon selecting a new collection
$("#collections").on("change", function() {
  refresh();
});

$("#publishColl").click(function() {
  var collection_id = $("#collections").val();
  var collection = {
    collection_id: collection_id,
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: "true"
  };
  editCollectionData(collection);

});

$("#saveColl, #unpublishColl").click(function() {
  var collection_id = $("#collections").val();
  var collection = {
    collection_id: collection_id,
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: "false"
  };
  editCollectionData(collection);

});

$("#finalDelete").click(function() {
  deleteCollection($("#collections").val());
});

$("#addCollection").click(function() {
  createCollection();
});

$("#addEmailWrap").click(function() {
  addEntry();
});



//edits collection data on the server
function editCollectionData(collection) {
  $.post("/ajax/editCollection", collection, function(data) {
    //update sidebar
    $('#collections option[value="' + collection.collection_id + '"]')
      .html(collection.collection_title);
    refresh();
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
  var request =  {
    collection_id: $("#collections").val(),
    entry_number: $('#subscriptionsContainer ol li').size() + 1
  };
  $.post("/ajax/createEntry", request, function(data) {
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