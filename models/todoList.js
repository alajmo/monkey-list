var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var Todo = new Schema({
//    content: String,
//    comment: {type: String, default: ''},
//    deadline: {type: String, default: ''},
//    status: {type: String, default: 'unfinished', min: 0, max: 12},
//    order: String
//});

var List = new Schema({
    todos: [{
            _id: String,
            order: String,
            content: String,
            comment: {type: String, default: ''},
            deadline: {type: String, default: ''},
            status: {type: String, default: 'unfinished', min: 0, max: 12}
        }]
});

//mongoose.model('Todo', Todo);
mongoose.model('List', List);
 