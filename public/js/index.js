
$.getJSON("/news", function (data) {
  console.log("Encountered /news getJSON");
  $.ajax({
    method: "GET",
    url: "/news"
  })
    .then(function (data) {
      console.log(data);  //Logs to browser console
      for (var i = 0; i < data.length; i++) {
        //   console.log("data.saved" + data[i].saved);
        //   var chkVal;
        //   if (data[i].saved === true) {
        //     chkVal = "checked";
        //   } else {
        //     chkVal = "unchecked";
        //   }
        // var htmlString = `<button class="btn float-left btn-sm btn-light mt-1 mx-3" id="saveBtn" data-id="${data[i]._id}" type="button">Save</button><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        // var htmlString = `<button class="btn float-left btn-sm btn-light mt-1 mx-3" id="saveBtn" data-id="${data[i]._id}" type="button">Toggle Save</button><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        var htmlString = `<h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        $("#articlepage").append(htmlString);
      };
    });
});


//***************************************************************************************/
// Whenever someone clicks "Clear News" 
//***************************************************************************************/
$("#clearNews").on("click", function () {
  console.log("Detected click on CLEAR");
  $.ajax({
    method: "POST",
    url: "/api/clear"
  })
    .then(function (data) {
      console.log(data);
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
  console.log("Detected click on LOAD");
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
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            // var htmlString = `<button class="btn float-left btn-sm btn-light mt-1 mx-3" id="saveBtn" data-id="${data[i]._id}" type="button">Toggle</button><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
            var htmlString = `<h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary">${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
            $("#articlepage").append(htmlString);
          }
        });
    });
  console.log("Outside of promise.");
});


//***************************************************************************************/
// Whenever someone clicks "Home" 
//***************************************************************************************/
$("#homeButton").on("click", function () {
  console.log("Detected click on Home");
  $.ajax({
    method: "GET",
    url: "/news"
  })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        // var htmlString = `<button class="btn float-left btn-sm btn-light mt-1 mx-3" id="saveBtn" data-id="${data[i]._id}" type="button">Toggle</button><h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary" >${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        var htmlString = `<h4 class="scrapeTitle" data-id="${data[i]._id}">${data[i].title}<h4><h6 class="scrapeSummary" >${data[i].summary}</h6><a class="scrapeLink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        $("#articlepage").append(htmlString);
      }
    });
});


//***************************************************************************************/
// Whenever someone clicks an article to comment on 
//***************************************************************************************/
$(document).on("click", "h4", function (event) {
  // $("#homeButton").on("click", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log("data-id you clicked on = " + thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      // $("#notes").append("<h4 id='noteTitle'>" + data.title + "</h4><br/>");
      // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append('<input id="titleinput" name="title" class="form-control" type="text" placeholder="New Title"></input>');
      // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append('<textarea id="bodyinput" name="body" class="form-control" type="text" placeholder="Comment"></textarea>');
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + thisId + "' id='savenote' type='button' class='btn btn-light mb-5'>Save Note</button>");

      console.log("try to find it: data[0] = " + JSON.stringify(data[0]));
      // $("#oldnotes").append("<button data-id='" + data._id + "' id='savenote' type='button' class='btn btn-light'>Save Note</button>");
      for (var i = 0; i < data[0].note.length; i++) {
        $("#notes").append("<div class='commentdiv'><h4 class='oldnotetext text-left px-2 mt-3 mb-0'>" + data[0].note[i].title + "</h4><br/><p class='oldnotetext text-left px-2 mt-0 mb-4'>" + data[0].note[i].body + "</p><p id='oldbody'></p></div>");
      };

      // $("#oldnotes").append("<h4 id='oldnoteTitle'>" + data.title + "</h4><br/>");
      // $("#oldnotes").append('<input id="oldtitleinput" name="title" class="form-control" type="text" placeholder="New Title"></input>');
      // $("#oldnotes").append('<textarea id="oldbodyinput" name="body" class="form-control" type="text" placeholder="Comment"></textarea>');


      // If there's a note in the article
      // console.log("data.note = " + JSON.stringify(data.note));
      if (data.note) {
        // $("#notes").append("<div class='commentdiv'><h4 class='oldnotetext text-left px-2 mt-3 mb-0'>" + data[0].note[i].title + "</h4><br/><p class='oldnotetext text-left px-2 mt-0 mb-4'>" + data[0].note[i].body + "</p><p id='oldbody'></p></div>");
        //   console.log("data.note had data.  populate form.")
        // Place the title of the note in the title input
        // $("#titleinput").text("did this work?");
        // $("#notes").append("<h6>" + data.note.body + "</h6>");
        // $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        // $("#bodyinput").val(data.note.body);
        // $("#notes").append("<div class='commentdiv'><h4 class='oldnotetext text-left px-2 mt-3 mb-0'>" + data.note.title + "</h4><br/><p class='oldnotetext text-left px-2 mt-0 mb-4'>" + data.note.body + "</p><p id='oldbody'></p></div>");
      }
    });
});


//***************************************************************************************/
// When you click the savenote button
//***************************************************************************************/
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  console.log("titleinput = " + $("#titleinput").val());
  console.log("bodyinput = " + $("#bodyinput").val());
  console.log("article = " + thisId);

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
      // Log the response
      console.log("this be the data" + JSON.stringify(data));
      // Empty the notes section
      // $("#notes").empty();
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
      console.log(data);
      console.log("try to find it: data[0] = " + JSON.stringify(data[0]));
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
      console.log(data);
      console.log("What is saved set to: data[0].saved = " + JSON.stringify(data[0].saved));
      // $("#oldnotes").append("<button data-id='" + data._id + "' id='savenote' type='button' class='btn btn-light'>Save Note</button>");
      if (data[0].saved === true) {
        console.log("data.save = true");
        saveValue = false;
        $(this).text("Save");
      } else {
        console.log("data.save = false");
        saveValue = true;
        $(this).text("Unsave");
      };

      // console.log("titleinput = " + $("#titleinput").val());
      // console.log("bodyinput = " + $("#bodyinput").val());
      console.log("article = " + thisId);

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
          // Log the response
          console.log("this be the data" + JSON.stringify(data));
          // Empty the notes section
        });

      // Also, remove the values entered in the input and textarea for note entry
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
});




