// Get the packages we need
var express = require("express");
var userStory1 = require("./userStory1");
var userStory2 = require("./userStory2");
var userStory3 = require("./userStory3");
var userStory4 = require("./userStory4");
// Create our Express application
var app = express();

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

app.use("/api/userStory1", userStory1);
app.use("/api/userStory2", userStory2);
app.use("/api/userStory3", userStory3);
app.use("/api/userStory4", userStory4);

// Start the server
app.listen(port);
console.log("Insert database on port " + port);
