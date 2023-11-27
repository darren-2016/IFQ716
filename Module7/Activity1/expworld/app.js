require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const options = require('./knexfile.js');
const knex = require('knex')(options);
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');
// const swaggerDocument = require('./docs/OriginalCopy-openapi.json');


const app = express();

// function logOriginalUrl (req, res, next) {
//   console.log('Request URL:', req.originalUrl);
//   next();
// }

const logOriginalUrl = require('./middleware/logOriginalUrl');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));   // morgan logger set to use 'dev' format string
// app.use(logger('short'));   // morgan logger set to use 'short' format string

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middleware/logOriginalUrl'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.get('/about', function (req, res) {
  res.send('about');
});

app.get('/random.text', function (req, res) {
  res.send('random.text');
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

logger.token('res', (req, res) => {
  const headers = {};
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h));
  return JSON.stringify(headers);
});


module.exports = app;
