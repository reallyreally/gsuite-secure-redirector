var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

var securityLayer = require('@really/really-secure');

var routeRedirector = require('./routes/redirector');

var config = require('./conf/app');

// Special handling to default HSTS by default
// Set ENV USE_HSTS if you want to enable it
if(process.env.USE_HSTS === undefined && config.appsecurity.hsts !== undefined){
  delete config.appsecurity.hsts;
  console.log("No USE_HSTS env variable set. Not using HSTS.");
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Trust Proxy Headers
if(process.env.TRUST_PROXY !== undefined){
  console.log("Enableing proxy headers trust.");
  app.enable('trust proxy');
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Secure site
app.use(securityLayer(config.appsecurity));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routeRedirector);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
