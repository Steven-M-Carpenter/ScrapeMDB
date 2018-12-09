var db = require("../models");

module.exports = function (app) {

  


//********************************************************************************************************/
//* If the route doesn't match, throw the user to the 404 page
//********************************************************************************************************/
  app.get("*", function (req, res) {
    res.render("404");
  });
 
};