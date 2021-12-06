var createError = require('http-errors');
const moment = require('moment');
const logger1=require('./logger1')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var app = express();
app.use(express.static('public'));
app.use(express.static('files'));
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded( { extended:false}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
  res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
  next();
  });
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { log } = require('console');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13945958166+wst',
  database: 'shop'
});
connection.connect((err) => {
  if(err){
    throw err;
  }
  console.log('Mysql connection ....');
}) 
var Shopconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13945958166+wst',
  database: 'shop'
});
app.use(logger1);
app.get('/allgood', function (req, res,next) {
  Shopconnection.query(`SELECT * From good`, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
}) 
app.get('/test', function (req, res,next) {
  Shopconnection.query(`SELECT good_image From good where good_id=1`, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
   /*  res.end(result); */
  })
}) 











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
