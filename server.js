var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require('./models')
// var dbA = require("./models/Article");
// var dbN = require("./models/Note");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;


// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


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
  db.Article.find({})
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
  db.Article.deleteMany({})
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
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        })
    });
  });
});


//********************************************************************************************************/
//* If the route doesn't match, throw the user to the 404 page
//********************************************************************************************************/
app.get("*", function (req, res) {
  res.render("404");
});

// Routes
// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);
// Routes
//var routes = require("./routes");


// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


module.exports = { app, PORT };