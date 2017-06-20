var express = require('express'),
	http = require('http'),
	swig = require('swig'),
	passport = require('passport'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');
var server = express();
var server_socket = http.createServer(server).listen(8000)
var io = require('socket.io').listen(server_socket)
// console.log(__dirname);

swig.setDefaults({
	cache : false
});


//Conf de express
server.use(bodyParser.urlencoded({
	extended : true 
}));
server.use(bodyParser.json());
server.use(cookieParser());
// server.use(session({ secret: 'mi clave'}));
server.use(session({secret: 'mi clave', resave: true, saveUninitialized: true}));
//Config Passport
server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser(function (user,done){
	done( null, user );
});


passport.deserializeUser(function (user,done){
	done( null, user );
});


//Config Swig
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', __dirname + '/app/views');

server.use(express.static('./public'));

//Controllers
require('./app/controllers/home')(server);
require('./app/controllers/user')(server, io);
require('./app/controllers/discuss')(server, io);

//Connections
require("./app/connections/facebook")(server);
require("./app/connections/twitter")(server);



// server.listen(8000, function(){
// 	console.log('Servidor corriendo');
// });