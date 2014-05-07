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

  var lastStartIndex;
  $( "#sortable" ).sortable({
    update: function(event, ui) {
      reorderEntry(lastStartIndex + 1, ui.item.index() + 1);
    },
    disabled: false,
    start: function(event, ui) {
      lastStartIndex = ui.item.index();
    }
  });
  
  /*
  *end of Pete's stuff
  */

  //MAX'S STUFF
refresh();

var prevID; //prev id used to save upon collection focus change
var prevVisible;

//get data from server and adjust the page accordingly
function refresh() {
  
  $("#settingsWrap").hide();
  $("#subscriberMainWrap").hide();
  $("#editHeader").show();
  $("#collectionWrap").show();
  
  var currentCollectionId = $("#collections").val();
  prevID = currentCollectionId; //slightly confusing nomenclature (I know, its not previous yet)

  if(currentCollectionId == null) {
      addEntry();
  } else {
    $.get("/ajax/" + currentCollectionId, function(data) {
      $("#collTitleInput").val(data.collection_title);
      $("#author").html("By: " + data.creator_name);
      $("#collDescriptInput").val(data.collection_description);
      $("#pageURL").val("localhost:8080/consumer/" + currentCollectionId);
      $("#pageURLLink").attr('href','/consumer/' + currentCollectionId);

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
            $("<a>").attr('href', "/" + entries[i].entry_id).html(entries[i].subject)
        ));
      }
      if ($('#subscriptionsContainer ol').html().length > 0) {
        $('#noLinksPrompt').hide();
      } else {
        $('#noLinksPrompt').show();
      }
      if (data.visible == 'false') { //when not visible, the collection is unpublished

        prevVisible = "false";
        $('.headerButton, #settingsHolder, #emailFreqContain, .urlHolder').removeClass('published');
        $('.headerButton, #settingsHolder, #emailFreqContain, .urlHolder').addClass('unpublished');
        $('#addEmailWrap').show();
        $( "#sortable" ).sortable( "option", "disabled", false );
        $('#collTitleInput, #collDescriptInput, #emailFrequency').attr('readonly', false);
      } else {
        prevVisible = "true";
        $('#addEmailWrap').hide();
        $( "#sortable" ).sortable( "option", "disabled", true );
        $('.headerButton, #settingsHolder, #emailFreqContain, .urlHolder').removeClass('unpublished');
        $('.headerButton, #settingsHolder, #emailFreqContain, .urlHolder').addClass('published');
        $('#collTitleInput, #collDescriptInput, #emailFrequency').attr('readonly', true); // these elements can't be edited when pubslished
      }
       if ($('#collections option').length == 1) {
        $('#deleteColl').hide();
      };
    })
      .fail(function() {
        //alert("error"); //an error occurred, we're gonna ignore
      });
  }

  // Don't show delete if on last collection
 
}

//change data upon selecting a new collection
$("#collections").on("change", function() {
  saveCurrCollectionState();
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

//autosave collection state when editing an old email
$("#subscriptionsContainer ol").click(function(event){
    saveCurrCollectionState();
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
  //autosave curr collection
  var collection_id = prevID;
  saveCurrCollectionState();

  //create the new collection
  createCollection();
});

$("#addEmailWrap").click(function() {
  saveCurrCollectionState();
  addEntry();
});

function saveCurrCollectionState(){
  var collection_id = prevID;
  var collection = {
    collection_id: collection_id,
    collection_title: $("#collTitleInput").val(),
    collection_description: $("#collDescriptInput").val(),
    visible: prevVisible,
    email_interval: 86400000 * $("#emailFrequency").val()
  };
  editCollectionData(collection);
}

//edits collection data on the serverName your collection
function editCollectionData(collection) {
  $.post("/ajax/editCollection", collection, function(data) {
    //update sidebar
    $('#collections option[value="' + collection.collection_id + '"]')
      .html(collection.collection_title);
    refresh();
  })
    .fail(function() {
      //alert("error"); //an error occurred, we're gonna ignore it
    });
}

//deletes the collection on the server
function deleteCollection(collectionId) {
  $.post("/ajax/deleteCollection", {collection_id : collectionId}, function(data) {
    $('#collections option[value="' + collectionId + '"]').remove();
    refresh();
  })
    .fail(function() {
      //alert("error"); //an error occurred, we're gonna ignore it
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
  }).fail(function() {
      //alert("error"); //an error occurred, we're gonna ignore it
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

function reorderEntry(startRow, endRow) {
  console.log("startRow: " + startRow + "       endRow: " + endRow);
  $.post("/ajax/reorderEntry",
  {
    collection_id: $("#collections").val(),
    startEntryNumber: startRow,
    endEntryNumber: endRow
  }).fail(function() {
      //alert("error"); //an error occurred, we're gonna ignore it
    });
}

function getSubscriptionData() {
  $.get("/ajax/subscriptionData", function(data) {
    console.log(data);
    $("#subscribeTable").find("tr:gt(0)").remove(); //clear all non header rows
    $.each(data.subscriptionData, function(i, collection) {
      var $row = $('<tr>');
      $row.append($('<td>').append($('<p>').text(collection[0].collection_title)));
      var appendData = function(row, datum) {
        var $ul = $('<ul>');
        row.append($('<td>').append($ul));
        $.each(collection, function(i, sub) {
          $ul.append($('<li>').text(sub[datum]));
        });
      }
      appendData($row, "address");
      appendData($row, "date_started");
      appendData($row, "progress"); 
      $("#subscribeTable").append($row);   
    });

  });
}


function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}
//END OF MAX'S 

//BEN'S STUFF
$("#logout").click(function() {
  $.post("/log_out", function(data) {
     window.location = "/";
  })
    .fail(function() {
      //alert("error"); //an error occurred, we're gonna ignore it
    });
});

$("#subscribeB").click(function(){
  $("#editHeader").hide();
  $("#collectionWrap").hide();
  $("#settingsWrap").hide();
  $("#subscriberMainWrap").show();
  getSubscriptionData();

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
    //alert("error"); //an error occurred, we're gonna ignore it
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
  }).done(function(data) {
       if(data === "incorrectPass"){
        alert("you entered an incorrect old password");
       }
       else{
          if(data === "passwordChanged"){
            alert("password changed");
          }
          $("#editHeader").show();
          $("#collectionWrap").show();
          $("#subscriberMainWrap").hide();
          $("#settingsWrap").show();
       }
      
  });
});
  //END OF BEN'S STUFF
});