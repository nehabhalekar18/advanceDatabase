// Get the packages we need
var express = require('express');
var userStory1 = require('./userStory1');

// Create our Express application
var app = express();

// Use environment defined port or 3000
var port = process.env.PORT || 3000;


app.use('/api/userStory1', userStory1);

// Start the server
app.listen(port);
console.log('Insert database on port ' + port);