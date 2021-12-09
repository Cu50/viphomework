/* const webSocketsServerPort = 3000;
const webSocketsServer = require('websocket').server;
const http = require('http');


const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 3000');

const wsServer = new webSocketsServer({
  httpServer:server
});


const getUniqueID= ()=>{
  const s4 = () =>Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
  return s4()+s4()+'-'+s4();
}
const client ={};
wsServer.on('request',function (request) {
  var userID = getUniqueID();
  console.log((new Date())+' Recived a new connection form '+ request.origin+'.');

  const wsconnection = request.accept(null,request.origin);
  client[userID] = wsconnection;
  wsconnection.on('message',function(message){
    if(message.type==='utf8'){
      console.log('Received Message:',message.utf8Data);


      for(key in client){
        client[key].sendUTF(message.utf8Data);
        console.log('sent message to:' ,client[key]);
      }
    }
  })

  
})
 */
/* 
const webSocketsServerPort = 4000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
});



 */


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
var Vipconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13945958166+wst',
  database: 'Vip'
});
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13945958166+wst',
  database: 'food'
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

app.get('/food', function (req, res,next) {
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  });
 const a='*';
  connection.query(`SELECT ${a} From food`, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
}) 
app.get('/food1',(req , res) => {
  let post = { food_id:12,food_name:"test",food_star:6 };
  let sql = 'INSERT INTO food SET ?';
  let query=connection.query(sql, post, (err,result) => {
    if(err) throw err;
    console.log(result);
    res.send("Post 1 Add")
  })
})
app.get('/food/:id',(req , res , next) => {
  connection.query(`SELECT ${req.params.id} From food`, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
})
app.get('/foodAdd/:id/:name/:star/:address/:store/:suggestion',(req , res , next) => {
  connection.query(`INSERT INTO food(food_id, food_name, food_star,food_address, food_store, food_suggestion) VALUES (${req.params.id},' ${req.params.name}', ${req.params.star}, '${req.params.address}', '${req.params.store}', '${req.params.suggestion}') `, function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
})
app.get('/foodU/:id/:name/:star/:address/:store/:suggestion',(req , res , next) => {
  connection.query(`UPDATE food SET food_name ='${req.params.name}' WHERE food_id =${req.params.id}`  , function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
})


app.post("/vipregister", (req, res) => {

  const vip_name = req.body.vip_name;
  const vip_password = req.body.vip_password;
  Vipconnection.query("INSERT INTO vip_init (vip_name,vip_password) VALUES (?,?)",
  [vip_name, vip_password],
  (err, result) => {
    console.log(err);
  }
  );
});

app.post("/viplogin", (req,res) => {
  const vip_name = req.body.vip_name;
  const vip_password = req.body.vip_password;
  Vipconnection.query(" SELECT * FROM vip_init WHERE vip_name = ? AND vip_password = ?",
  [vip_name, vip_password],
  (err, result) => {
    if(err)
    res.send({err:err})
      if (result.length >0) {
        res.send(result)
      } else {
        res.send({message : "Wrong username/password cobination!"})
      }
    
  }
  );

})

app.get('/vip', function (req, res,next) {
  res.writeHead(200, {
    "Content-Type": "text/html;charset=utf-8"
  });
  Vipconnection.query('SELECT * From vip_init', function (err, rows, fields) {
    if (err) throw err
    result=JSON.stringify(rows);
    res.end(result);
  })
}) 
app.post('/vip_coupons', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log(req.body);
  Vipconnection.query('SELECT vip_coupons.vip_coupons_id,vip_coupons.vip_coupons_count, vip_coupons.vip_coupons_present FROM vip_coupons,vip_init WHERE vip_coupons.vip_coupons_count <= vip_init.vip_coupons AND vip_init.vip_name =?',[vip_name],  (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.end(result);
  })
})
app.post('/vipchangecoupons', function (req, res, next) {
  const vip_name = req.body.vip_name;
  const count = req.body.count;
  Vipconnection.query(`UPDATE vip_init SET vip_coupons = vip_coupons - ? WHERE vip_name = ?`,[count,vip_name], (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.send(Result);
  })
}) 
app.post('/vip_coupons_changenumber', function (req, res, next) {
  const vip_name = req.body.vip_name;
  const vip_coupons_id = req.body.vip_coupons_id;
  Vipconnection.query(`UPDATE vip_coupons_number set
  vip_coupons_number = vip_coupons_number + 1
  WHERE vip_coupons_number.vip_name= ? && vip_coupons_number.vip_coupons_id= ?`,[vip_name,vip_coupons_id], (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.send(Result);
  })
}) 
app.post('/vip_coupons_number', function (req, res, next) {
  const vip_name = req.body.vip_name;
  console.log(vip_name);
  Vipconnection.query(`SELECT
	vip_coupons.vip_coupons_id, 
	vip_coupons_number.vip_coupons_number, 
	vip_coupons.vip_coupons_present
FROM
	vip_coupons_number
	INNER JOIN
	vip_coupons
	ON 
		vip_coupons_number.vip_coupons_id = vip_coupons.vip_coupons_id
WHERE
	vip_coupons_number.vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.send(Result);
  })
}) 
app.post('/vipinfo', function (req, res, next) {
  const vip_name = req.body.vip_name;
  console.log(vip_name);
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT * From vip_init WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    result=JSON.stringify(Result);
    res.send(Result);
  })
}) 
app.post('/vip/:id', function (req, res,next) {
  console.log(req.body);
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT * From vip_init WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/viplevelname', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT name from vip_init NATURAL JOIN vip_level_name WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/vip_course_count', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`SELECT COUNT(lession_id) as coo From vip_course WHERE vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/viplevelupdate', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi");
  console.log(vip_name);
  Vipconnection.query(`UPDATE vip_init set vip_level=(select vip_level from vip_level_name where (SELECT COUNT(lession_id) from vip_course WHERE vip_name=?) BETWEEN vip_level_name.vip_course_low and  vip_level_name.vip_course_high) where vip_name=?`,[vip_name,vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 

app.post('/vipSelectCourse', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log(vip_name);
  Vipconnection.query(`SELECT lession_id,lession_name,lession_score,teacher_name from lession  NATURAL JOIN teacher where lession_id not in ( SELECT lession_id from vip_course where vip_name = ? ) `,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post('/vipDeleteCourse', function (req, res,next) {
  const number = req.body.number;
  Vipconnection.query(`DELETE FROM vip_course WHERE number=?  `,[number], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
  })
}) 
app.post("/vipAddCourse", (req,res) => {
  const vip_name = req.body.vip_name;
  const lession_id = req.body.lession_id;
  Vipconnection.query(" INSERT INTO vip_course (vip_name,lession_id) VALUES (?,?)",
  [vip_name, lession_id],
  (err, result) => {
    if(err)
    res.send({err:err})
  }
  );

})
app.post('/vipCourse', function (req, res,next) {
  const vip_name = req.body.vip_name;
  console.log("shabi+++");
  console.log(vip_name);
  Vipconnection.query(`SELECT
	vip_course.number, 
	vip_course.lession_id, 
	lession.lession_name,
  lession.lession_score
FROM
	vip_course
	INNER JOIN
	lession
	ON 
		vip_course.lession_id = lession.lession_id
		and 
		vip_name = ?`,[vip_name], (err, Result) => {
    if (err) throw err
    /* result=JSON.stringify(Result); */
    res.send(Result);
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
