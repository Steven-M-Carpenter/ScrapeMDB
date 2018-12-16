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


// Routes
// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);
// Routes
//var routes = require("./routes");


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
  // db.Note.deleteMany({ saved: true })
  .then(function(dbArticle) {
      res.render("index");
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
  // db.Note.deleteMany({})
  // // db.Note.deleteMany({ saved: true })
  // .then(function(dbNote) {
  //     res.render("index");
  // })
  // .catch(function(err) {
  //   // If an error occurred, send it to the client
  //   res.json(err);
  // });
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
// Route for grabbing a specific Article by id, populate it with it's note
//********************************************************************************************************/
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  console.log("incoming ID = " + req.params.id);
  db.Article.find({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//********************************************************************************************************/
// Route for grabbing a specific Article by id, populate it with it's note
//********************************************************************************************************/
app.get("/notes/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  console.log("incoming ID = " + req.params.id);
  console.log("running db.Note.find");
  db.Note.find({ article: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("article")
    .then(function(dbNote) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log("The note was found");
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log("The note was not found");
      res.json(err);
    });
});


//********************************************************************************************************/
// Route for saving/updating an Article's associated Note
//********************************************************************************************************/
app.post("/api/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      console.log("passed id = " + req.params.id);
      console.log("req.body#2 = " + JSON.stringify(req.body));
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//********************************************************************************************************/
// Route for saving/updating an Article's associated Note
//********************************************************************************************************/
app.post("/api/save/article/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.update(req.body)
    .then(function(dbArticle) {
      console.log("passed id = " + req.params.id);
      console.log("req.body#2 = " + JSON.stringify(req.body));
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: req.body.saved }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


//********************************************************************************************************/
//* If the route doesn't match, throw the user to the 404 page
//********************************************************************************************************/
app.get("*", function (req, res) {
  res.render("404");
});



// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});


module.exports = { app, PORT };