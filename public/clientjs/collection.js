$(document).ready(function() {


  /*
  *Pete's stuff
  */

  $('#collTitleInput, #collDescriptInput').change(function() {
    $('#saveCheckContain, #saveColl').removeClass('saved');
  });
  $('#collTitleInput, #collDescriptInput').keydown(function() {
    $('#saveCheckContain, #saveColl').removeClass('saved');
  });
  $('#emailFrequency, #addEmailContain, #publishColl').click(function() {
    $('#saveCheckContain, #saveColl').removeClass('saved');
  });

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
  $( "#sortable" ).sortable();
  
  /*
  *end of Pete's stuff
  */

  //MAX'S STUFF
refresh();

//get data from server and adjust the page accordingly
function refresh() {
  
  $("#settingsWrap").hide();
  $("#subscriberMainWrap").hide();
  $("#editHeader").show();
  $("#collectionWrap").show();
  
  var currentCollectionId = $("#collections").val();
  if(currentCollectionId == null) {
      addEntry();
  } else {
    $.get("/ajax/" + currentCollectionId, function(data) {
      $("#collTitleInput").val(data.collection_title);
      $("#author").html("By: " + data.creator_name);
      $("#collDescriptInput").val(data.collection_description);
      $("#pageURL").val("digestible.io/consumer/" + currentCollectionId);

      var emailFrequencyInDays = data.email_interval/86400000;
      $("#emailFrequency").val(emailFrequencyInDays);
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
        $('#collTitleInput, #collDescriptInput, #emailFrequency').attr('disabled', false);
      } else {
        $('.headerButton, #settingsHolder').removeClass('unpublished');
        $('.headerButton, #settingsHolder').addClass('published');
        $('#collTitleInput, #collDescriptInput, #emailFrequency').attr('disabled', true); // these elements can't be edited when pubslished
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
    visible: "true",
    email_interval: 86400000 * $("#emailFrequency").val()
  };
  editCollectionData(collection);

});

$("#saveColl, #unpublishColl").click(function() {
  var collection_id = $("#collections").val();
  var collection = {
    collection_id: collection_id,
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: "false",
    email_interval: 86400000 * $("#emailFrequency").val()
  };
  editCollectionData(collection);

  $('#saveCheckContain, #saveColl').addClass('saved');
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

$("#sortable").on("sortupdate", function(event, ui) {
  console.log("position: " + ui.position);
  console.log("original position: " + ui.originalPosition);
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

function insertEntry(startRow, endRow) {

}


function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}
//END OF MAX'S STUFF

//BEN'S STUFF
$("#logout").click(function() {
  $.post("/log_out", function(data) {
     window.location = "/";
  })
    .fail(function() {
      alert("error");
    });
});

$("#subscribeB").click(function(){
  $("#editHeader").hide();
  $("#collectionWrap").hide();
  $("#settingsWrap").hide();
  $("#subscriberMainWrap").show();
});

$("#settingsB").click(function(){
  
  $.post("/ajax/loadSettings", function(data) {
     $('#name').val(data.name);
     $('#street').val(data.street_address);
     $('#city').val(data.city);
     $('#state').val(data.state); 
     $('#zip').val(data.zipcode);
  })
  .fail(function() {
    alert("error");
  });

  $("#editHeader").hide();
  $("#collectionWrap").hide();
  $("#subscriberMainWrap").hide();
  $("#settingsWrap").show();
});

$("#settingsSave").click(function(){
  $.post("/ajax/saveSettings", {
     name: $('#name').val(),
     password: $('#password').val(),
     newpass: $('#newPass').val(),
     street: $('#street').val(),
     city:$('#city').val(),
     state:$('#state').val(), 
     zip:$('#zip').val()
  },function(data,status) {
       if(data === "incorrectPass"){
        alert("you entered an incorrect old password");
       }
       else if(data == "passwordChanged"){
        alert("password changed");
       }
       alert(data);  
  });
});
  //END OF BEN'S STUFF
});