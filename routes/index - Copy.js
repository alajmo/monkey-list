/*
 * GET home page.
 */
var mongoose = require('mongoose');
require('../models/todoList');
var Todo = mongoose.model('Todo')
        , List = mongoose.model('List');
/**
 * Hash
 */
var Hashids = require('hashids'),
        hashids = new Hashids("Krivaja je u mojoj dusi", 4);

exports.index = function(req, res) {
    res.render('index', {
        title: 'index'});
};

exports.create = function(req, res) {
    new Todo({
        content: req.body.content
    }).save(function(err, todo) {
        List.update({_id: req.body.lid}, {$push: {todos: todo}}, {upsert: true}, function(err, tlist) {
            res.send(todo._id);
        });
    });
};
exports.destroy = function(req, res) {
    Todo.findOne({_id: req.body.tid}, function(err, todo) {
        List.update({_id: req.body.lid}, {$pull: {todos: todo}}, function(err, tlist) {
            todo.remove(function(err, todo) {
                res.end();
            });
        });
    });
};
exports.update = function(req, res) {
    Todo.findOne({_id: req.body.tid}, function(err, todo) {
        if (req.body.typeUpdate === 'content') {
            todo.content = req.body.value;
            var json = JSON.parse(JSON.stringify({'todos.$.content': req.body.value}));
        }
        else if (req.body.typeUpdate === 'comment') {
            todo.comment = req.body.value;
            var json = JSON.parse(JSON.stringify({'todos.$.comment': req.body.value}));
        }
        else {
            todo.deadline = req.body.value;
            var json = JSON.parse(JSON.stringify({'todos.$.deadline': req.body.value}));
        }
        todo.save();
        List.update({_id: req.body.lid,
            'todos._id': req.body.tid},
                {$set: json},
                function(err, tlist) {
                    if (err) {
                        console.log(err);
                    }
                    res.end();
                });
    });
};
exports.status = function(req, res) {
    Todo.findOne({_id: req.body.tid}, function(err, todo) {
        if (todo.status === 'unfinished') {
            todo.status = 'finished';
        }
        else {
            todo.status = 'unfinished';
        }
        todo.save();
        List.update({_id: req.body.lid,
            'todos._id': req.body.tid},
                {$set: {'todos.$.status': todo.status}},
                function(err, tlist) {
                    if (err) {
                        console.log(err);
                    }
                    res.end();
                });
    });
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
                                content: todos_obj.content[todo],
                                comment: todos_obj.comment[todo],
                                deadline: todos_obj.deadline[todo],
                                order: todo
                            }
                        }}, {upsert: true}, function(err, todos) {
            });
        }
        res.redirect('/' + tlist.id);
    });
};

//exports.sort = function(req, res) {
//    Todo.find().
//            sort('order').
//            exec(function(err, todos) {
//            
//    });
//
//
//};

exports.saved = function(req, res) {
//    var lid = hashids.decrypt(req.params.lid);
//    var ses = 5;
//    console.log(req.params.lid);
    List.findOne({_id: req.params.lid}, function(err, todos) {
        console.log(todos.todos.length);
    });
    List.findOne({'_id': req.params.lid}, function(err, tlist) {
        res.render('saved', {
            title: 'saved',
            lid: tlist.id,
            todos: tlist.todos
        });
    });

};
