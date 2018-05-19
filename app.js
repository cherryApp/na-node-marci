var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const Auth = require('./module/auth');
const requireLogin = require('./middleware/requireLogin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('./middleware/nodeStatic'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Bejelentkezés ellenőrzése.
 */
app.use((req, res, next) => {
  res.locals.authenticated = Auth.isAuthenticated(req, res);
  res.locals.user = Auth.getInfo(req, res);
  next();
});

app.all('/admin/*', requireLogin);


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));
app.use('/ajax', require('./routes/ajax'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
