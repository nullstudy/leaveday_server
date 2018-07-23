var config = require('config');
var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dbConnect = require('./util/dbConnect')(config);
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // 모든 도메인으로부터 수신되는 액세스 요청을 허용 (모든 ip주소에서부터 오는 요청을 전부다 허락해 주겠다)
    res.header("Access-Control-Request-Headers", "*");
    res.header('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "Authorization,Content-Type, Origin, X-Requested-With,  Accept");
    next();
});

var session = require('express-session');
var passport = require('passport');

sessionMiddleware = session({
  secret: "djklsjojas!@@&!^",
  resave: true,
  saveUninitialized: true
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
});

const userRouter = require('./routes/user.js')(app,passport, config);
const jobdairyRouter = require('./routes/jobdiary.js')(app);
const todoRouter = require('./routes/todo.js')(app);

app.listen(3001,function(req,res){
  console.log('server connect success');
})
