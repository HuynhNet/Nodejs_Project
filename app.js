var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var multer = require('multer');
var cookieSession = require('cookie-session');
var paginate = require('express-paginate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
    name: 'session',
    keys: ['secret'],
//abc
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// format session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// format body-parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// format validator
app.use(expressValidator());

// format flash
app.use(flash());

// format paginate
app.use(paginate.middleware(10,50));

// list router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
