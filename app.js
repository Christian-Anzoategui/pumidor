//FireBase apiKey
var credentials = require('./credentials');
var api_key = credentials.api_key;

var
express = require('express'),
path = require('path'),
logger = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
session = require('express-session'),
expressValidator = require('express-validator'),
flash = require('connect-flash'),
firebase = require('firebase');

 var config = {
    apiKey: api_key,
    authDomain: "laisalive-ca5f2.firebaseapp.com",
    databaseURL: "https://laisalive-ca5f2.firebaseio.com",
    storageBucket: "laisalive-ca5f2.appspot.com",
    messagingSenderId: "525971148673"
  };

 firebase.initializeApp(config);


//var FbApp = firebase.initializeApp(config);
//module.exports.FBApp = FbApp.database(); 

// Route Files
var routes = require('./routes/index');
var teas = require('./routes/teas');
var types = require('./routes/types');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logger
app.use(logger('dev'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// Handle Sessions

app.use(session({
secret: 'secret',
saveUninitialized: true,
resave: true
}));

// Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var 
		namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

	while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	}
	return {
		param : formParam,
		msg : msg,
		value: value
	};
  }
}));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.authdata = firebase.auth().currentUser;
	res.locals.page = req.url;
	next();
});

// Get User Info
/*
app.get('*', function(req, res, next){
	if(firebase.UserInfo.uid() != null){
		var userRef = firebase.database().ref('/users/');
		console.log(userRef);
		userRef.orderByChild("uid").startAt(FbRef.UserInfo().uid).endAt(FbRef.UserInfo().uid);
		res.locals.user = snapshot.val();
	}
	next();
});
*/

// Routes
app.use('/', routes);
app.use('/teas', teas);
app.use('/types', types);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

// Run Server
app.listen(app.get('port'), function(){
	console.log('Server started on port: '+app.get('port'));
});
