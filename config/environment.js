module.exports = function(app, express, path) {
    app.configure(function() {
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, '../views'));
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({secret: "hihi"}));
        app.use(app.router);
        app.use(require('stylus').middleware(path.join(__dirname, '../public')));
        app.use(express.static(path.join(__dirname, '../public')));
    });
};