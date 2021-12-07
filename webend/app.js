var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* var httpServer = require('http').createServer();
var io = require("socket.io")(httpServer);
httpServer.listen(3000); */
var app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
  res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
  next();
  });

let httpServer= require('http').Server(app);
var io = require('socket.io')(httpServer, { cors: true });

app.listen(3000);
io.listen(3031);



io.on('connection',  (socket)=>{
  console.log('client connect server, ok!');

  // io.emit()方法用于向服务端发送消息，参数1表示自定义的数据名，参数2表示需要配合事件传入的参数
  io.emit('server message', {msg:'client connect server success'});

  // socket.broadcast.emit()表示向除了自己以外的客户端发送消息
  socket.broadcast.emit('server message', {msg:'broadcast'});

  // 监听断开连接状态：socket的disconnect事件表示客户端与服务端断开连接
  socket.on('disconnect', ()=>{
    console.log('connect disconnect');
  });
  
  // 与客户端对应的接收指定的消息
  socket.on('client message', (data)=>{
    cosnole.log(data);// hi server
  });

  socket.disconnect();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
