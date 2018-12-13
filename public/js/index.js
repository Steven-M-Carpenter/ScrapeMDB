
$.getJSON("/news", function (data) {
  console.log("Encountered /news getJSON");
  $.ajax({
    method: "GET",
    url: "/news"
  })
    .then(function (data) {
      console.log(data);  //Logs to browser console
      for (var i = 0; i < data.length; i++) {
        var htmlString = `<h4 data-id=" ${data[i]._id}">${data[i].title}<h4><h6>${data[i].summary}</h6><a class="newslink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
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
            var htmlString = `<h4 data-id=" ${data[i]._id}">${data[i].title}<h4><h6>${data[i].summary}</h6><a class="newslink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
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
        var htmlString = `<h4 data-id=" ${data[i]._id}">${data[i].title}<h4><h6>${data[i].summary}</h6><a class="newslink" href="${data[i].link}">${data[i].link}</a><br/><br/><br/>`
        $("#articlepage").append(htmlString);
      }
    });
});


