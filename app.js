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
var app = express();
mongoose.connect('mongodb://127.0.0.1/dothis');

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

app.listen(3000, function() {
    console.log('Express server listening on port ' + app.get('port'));
});

