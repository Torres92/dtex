var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const Service = require('../models/service');
var User = require('../models/user');


//ensureAuthenticated,

// Get Homepage
router.get('/', (req, res, next) => {
	res.render('index');

});



passport.use('login',new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Usuario Invalido' });
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Clave Inválida' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});


function usernameToLowerCase(req, res, next){
    req.body.username = req.body.username.toLowerCase();
    next();
}

router.post('/login', usernameToLowerCase, function(req, res, next) {

  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
    	req.flash('error_msg', info.message);
    	return res.redirect('/'); 
    };


    req.logIn(user, function(err) {
      if (err) throw err 
      if (user.role === 'administrador') {
      	return res.redirect('/admin');	
      }
      if (user.role === 'empresa') {
      	return res.redirect('/company' );	
      }
      if (user.role === 'conductor') {
      	return res.redirect('/driver');	
      }
      //return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});






function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}




module.exports = router;