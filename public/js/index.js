
$.getJSON("/news", function (data) {
  $.ajax({
    method: "GET",
    url: "/news"
  })
    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var htmlString = `<u><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4></u><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        $("#articlepage").append(htmlString);
      };
    });
});


//***************************************************************************************/
// Whenever someone clicks "Clear News" 
//***************************************************************************************/
$("#clearNews").on("click", function () {
  $.ajax({
    method: "POST",
    url: "/api/clear"
  })
    .then(function (data) {
      // Empty the news section
      $("#notes").empty();
      $("#oldnotes").empty();
      $("#articlepage").empty();
    });
});


//***************************************************************************************/
// Whenever someone clicks "Load News" 
//***************************************************************************************/
$("#loadNews").on("click", function () {
  event.preventDefault();
  $.ajax({
    method: "POST",
    url: "/api/load",
    data: {}
  })
    .then(function (data) {
      $.ajax({
        method: "GET",
        url: "/news"
      })
        .then(function (data) {
          for (var i = 0; i < data.length; i++) {
            var htmlString = `<u><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4></u><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
            $("#articlepage").append(htmlString);
          }
        });
    });
});


//***************************************************************************************/
// Whenever someone clicks "Home" 
//***************************************************************************************/
$("#homeButton").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/news"
  })
    .then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var htmlString = `<u><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4></u><h6 class="scrapeSummary" >${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        $("#articlepage").append(htmlString);
      }
    });
});


//***************************************************************************************/
// Whenever someone clicks an article to comment on 
//***************************************************************************************/
$(document).on("click", "h4", function (event) {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      $("#notes").append('<input id="titleinput" name="title" class="form-control" type="text" placeholder="New Title"></input>');
      $("#notes").append('<textarea id="bodyinput" name="body" class="form-control" type="text" placeholder="Comment"></textarea>');
      $("#notes").append("<button data-id='" + thisId + "' id='savenote' type='button' class='btn btn-light mb-5'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        for (var i = 0; i < data[0].note.length; i++) {
          $("#notes").append("<div class='commentdiv'><h4 class='oldnotetext text-left px-2 mt-3 mb-0'>" + data[0].note[i].title + "</h4><br/><p class='oldnotetext text-left px-2 mt-0 mb-4'>" + data[0].note[i].body + "</p><p id='oldbody'></p></div>");
        };
      };
    });
});


//***************************************************************************************/
// When you click the savenote button
//***************************************************************************************/
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val(),
      // Include the article ID
      article: thisId
    }
  })
    // With that done
    .then(function (data) {
    });
  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");


  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      for (var i = 0; i < data[0].note.length; i++) {
        $("#notes").append("<div class='commentdiv'><h4 class='oldnotetext text-left px-2 mt-3 mb-0'>" + data[0].note[i].title + "</h4><br/><p class='oldnotetext text-left px-2 mt-0 mb-4'>" + data[0].note[i].body + "</p><p id='oldbody'></p></div>");
      };
    });
});


$(document).on("click", "#saveBtn", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var thisButton = $(this);
  var saveValue;

  //See what the saved value is set to
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      if (data[0].saved === true) {
        saveValue = false;
        $(this).text("Save");
      } else {
        saveValue = true;
        $(this).text("Unsave");
      };

      // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/api/save/article/" + thisId,
        data: {
          // Value taken from note textarea
          saved: saveValue
        }
      })
        // With that done
        .then(function (data) {
        });

      // Also, remove the values entered in the input and textarea for note entry
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
});




