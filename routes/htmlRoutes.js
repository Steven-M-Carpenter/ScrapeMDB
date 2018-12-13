var db = require("../models");

module.exports = function (app) {

//***************************************************************************************/
// Handle the route to the default page
//***************************************************************************************/
app.get("/", function (req, res) {
  res.render("index");
});


//***************************************************************************************/
// Handle the route to the default page
//***************************************************************************************/
app.get("/news", function (req, res) {
  db.find({})
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
    // console.log(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


//***************************************************************************************/
// Handle the route to clear all records
//***************************************************************************************/
app.post("/api/clear", function (req, res) {
  db.deleteMany({})
  .then(function(dbArticle) {
      res.render("index");
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});


//***************************************************************************************/
// Handle the route to load new records
//***************************************************************************************/
app.post("/api/load", function (req, res) {
  // Grab the body of the html with axios
  axios.get("https://www.reuters.com/news/technology/").then(function (response) {
    // Load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every story-content class
    $(".story-content").each(function (i, element) {
      // Save an empty result object
      var result = {};
      // Add the title, href, and summary text of every item and save them as properties of the result object
      result.title = $(this)
        .children(".story-title, h3, a")
        .text().replace(/\n\t+/g, '');
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children("p")
        .text();

      // Create a new Article using the `result` object built from scraping
      // db.Article.create(result)
      db.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
      // res.render("index");
    });
  });
});


//********************************************************************************************************/
//* If the route doesn't match, throw the user to the 404 page
//********************************************************************************************************/
app.get("*", function (req, res) {
  res.render("404");
});





  
};