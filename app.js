const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const conn = require('./config/dbconnect');
const logger = require('morgan');
const pug = require('pug');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  name: 'S31kd112kfdk',
  secret: process.env.SESSION_SECRET_KEY,
  resave : false,
  saveUninitialized: true,
	store: new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 100 * 60 * 60,
    expiration : 100 * 60 * 60 * 12 ,// detik * menit * jam * hari * minggu
    createDatabaseTable: true
	}, conn)
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/UPLOADER',express.static(path.join(__dirname, 'UPLOADER')));

app.use('/', require('./routes'));
app.use('/login', require('./modules/login'));

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
