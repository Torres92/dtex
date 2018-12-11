const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('./config/config');



var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var driver = require('./routes/driver');
var company = require('./routes/company');


// Init App
var app = express();
require('./db')

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout:'layout',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname:'.handlebars',
}));
app.set('view engine', 'handlebars');


//dev middleware
app.use(morgan('dev'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));// para  extender los inputs
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pdf-files', express.static(__dirname + '/pdf-files'));

// Set global errors variable
app.locals.errors = null;

// Express Session
app.use(session({
    secret: 'Dunkinrules',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use('*',function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/driver', driver);
app.use('/company', company);

app.use((req, res, next)=> {
  res.status(404).render('./404');
});
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
	console.log('Server started on port '+app.get('port'));
});