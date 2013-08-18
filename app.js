/**
 * Module dependencies.
 */
var express = require('express')
        , routes = require('./routes')
        , http = require('http')
        , path = require('path')
        , mongoose = require('mongoose');

/**
 *  Creates the server and connect to mongodb
 */
var uristring = "mongodb://heroku_app17570275:nbdabcs8vebq3nh28rvhp58kh1@ds041238.mongolab.co m:41238/heroku_app17570275";

var theport = process.env.PORT || 5000;
var database = null;
var app = express();
//mongoose.connect('mongodb://localhost/monkey-list');

mongoose.connect(uristring, function(err, db) {
    console.log("connected, db: " + db);

    database = db;

    database.addListener("error", function(error) {
        console.log("Error connecting to MongoLab");

    });
});

/**
 * Sets the environment
 */
require('./config/environment')(app, express, path);

//// development only
//if ('development' == app.get('env')) {
//    app.use(express.errorHandler());
//}

/**
 * Routers
 */
app.get('/', routes.index);
app.post('/create/', routes.create);
app.post('/destroy/', routes.destroy);
app.post('/update/', routes.update);
app.post('/status/', routes.status);
app.post('/sort/', routes.sort);
app.post('/save/', routes.save);
app.get('/:lid', routes.saved);

app.listen(theport, function() {
    console.log('Express server listening on port ' + app.get('port'));
});

