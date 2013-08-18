/*
 * GET home page.
 */
var mongoose = require('mongoose');
require('../models/todoList');
//var Todo = mongoose.model('Todo')
var List = mongoose.model('List');
/**
 * Hash
 */

exports.index = function(req, res) {
    res.render('index', {
        title: 'index'});
};

exports.create = function(req, res) {
    List.update({_id: req.body.lid}, {$push: {todos: {_id: req.body.tid, order: req.body.order, content: req.body.content}}}, {upsert: true}, function(err, tlist) {
        res.end();
    });
};
exports.destroy = function(req, res) {
    List.update({_id: req.body.lid}, {$pull: {todos: {_id: req.body.tid}}}, function(err, list) {
        res.end();
    });
};
exports.update = function(req, res) {

    if (req.body.typeUpdate === 'content') {
        var json = JSON.parse(JSON.stringify({'todos.$.content': req.body.value}));
    }
    else if (req.body.typeUpdate === 'comment') {
        var json = JSON.parse(JSON.stringify({'todos.$.comment': req.body.value}));
    }
    else {
        var json = JSON.parse(JSON.stringify({'todos.$.deadline': req.body.value}));
    }
    List.update({_id: req.body.lid,
        'todos._id': req.body.tid},
            {$set: json},
            function(err, tlist) {
                if (err) {
                    console.log(err);
                }
                res.end();
            });
}
;
exports.status = function(req, res) {
    var status = req.body.status;
    if (status === 'unfinished') {
        status = 'finished';
    }
    else {
        status = 'unfinished';
    }
    List.update({_id: req.body.lid,
        'todos._id': req.body.tid},
            {$set: {'todos.$.status': status}},
            function(err, tlist) {
                if (err) {
                    console.log(err);
                }
                res.end();
            });
};

exports.sort = function(req, res) {
    var new_position = req.body.new_position;
    var tids = req.body.tids;
    for (pos in new_position) {
        List.update({_id: req.body.lid, todos: {$elemMatch: {_id: tids[pos]}}}, {$set: {"todos.$.order": pos}}, function(err, tlist) {
        });
    }
    res.end();
};

exports.save = function(req, res) {
    /**
     * Creates new List, inside the List it creates new Todo's and places them inside the List
     */
    /* If single todo, turn into object(starts of as String otherwise) */
    if (typeof(req.body.content) === 'string') {
        var num = [req.body.content];
        var todos_obj = req.body;
    }
    else {
        var num = req.body.content;
        var todos_obj = req.body;
    }

    new List().save(function(err, tlist) {
        for (var todo in num) {
            List.update({_id: tlist.id},
                    {$push: {todos: {
                                _id: todo,
                                order: todo,
                                content: todos_obj.content[todo],
                                comment: todos_obj.comment[todo],
                                deadline: todos_obj.deadline[todo]
                            }
                        }}, {upsert: true}, function(err, todos) {
            });
        }
        res.redirect('/' + tlist.id);
    });
};

exports.saved = function(req, res) {
//    var lid = hashids.decrypt(req.params.lid);
//    var ses = 5;
//    console.log(req.params.lid);

    List.findOne({'_id': req.params.lid}, function(err, tlist) {
        res.render('saved', {
            title: 'saved',
            lid: tlist.id,
            todos: tlist.todos
        });
    });

};
