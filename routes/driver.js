var express = require('express');
var router = express.Router();var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const Service = require('../models/service');
var User = require('../models/user');


// Obteniendo Servicios DRIVER ROUTE
router.get('/', isDriver, nocache, async (req, res, next) => {
  const { name } = res.locals.user;	
  const services = await Service.find({"available": true}).sort({"date.request": 1});
  const assigned = await Service.find({"meta.driver": name, "completed": false}).sort({"date.request": 1});
  const completed = await Service.find({"meta.driver": name, "completed": true}).sort({"date.request": -1});
  const colength = completed.length;
  const aslength = assigned.length;
  const selength = services.length
  res.render('./driver/driver', {
  	services,
  	assigned,
  	completed,
  	colength,
  	aslength,
  	selength
  });

});


// Asignando servicio a conductor
router.get('/assign', isDriver, async (req, res)=> {
	const { driver } = req.query;
	const { id } = req.query;
	try {
	const service = await Service.findById(id);
	const user = await User.findById(driver);
	const name = user.name;
	const dni = user.dni;
	service.meta.driver = name;
	service.available = !service.available;
	service.meta.dni = dni;
	await service.save();
	res.redirect('/driver');
	} catch(e){
		console.log(e);
		req.flash('error_msg', 'Ha ocurrido un error con la base de datos');
		res.redirect('./driver');
	}
});



// Actualizando estado un servicio tomado
router.get('/turn/:id', isDriver, async (req, res)=> {
	const { id } = req.params;
	try {
		const service = await Service.findById(id);
		service.status = !service.status;
		var taken = new Date();
		var month = taken.getMonth();
		var year = taken.getFullYear();
		var day = taken.getDate();
		var notHour = taken.getHours();
		if( notHour < 5){
		  var hour = notHour + 19;
		}else {
		  var hour = notHour - 5;
		}	
		var min = taken.getMinutes();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (min < 10) {
			min = '0' + min;
		}




		const hrRe = day + '/' + month + '/' + year + ' - ' + hour + ':' + min; 
		service.meta.hrRe = hrRe;
		service.meta.taken = taken;
		await service.save();
		res.redirect('/driver');
	} catch(e){
		console.log(e);
		req.flash('error_msg', 'Ha ocurrido un error con la base de datos');
		res.redirect('./driver');
	}
});



// Actualizando entrega un servicio
router.get('/edit/:id', isDriver, async (req, res)=> {
	const { id } = req.params;
	try {
		const service = await Service.findById(id);
		service.completed = !service.completed;
		var deliver = new Date();
		var month = deliver.getMonth();
		var year = deliver.getFullYear();
		var day = deliver.getDate();
		var notHour = deliver.getHours();
		var min = deliver.getMinutes();

		if( notHour < 5){
		  var hour = notHour + 19;
		}else {
		  var hour = notHour - 5;
		}	
		var min = deliver.getMinutes();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (min < 10) {
			min = '0' + min;
		}
		const hrEn = day + '/' + month + '/' + year + ' - ' + hour + ':' + min;; 
		service.meta.hrEn = hrEn;
		service.meta.deliver = deliver;
		service.driverPrice.total = (service.comment.newPrice * 0.7).toFixed(2);
		await service.save();
		res.redirect('/driver');
	} catch(e){
		console.log(e);
		req.flash('error_msg', 'Ha ocurrido un error con la base de datos');
		res.redirect('./driver');
	}
});

function isDriver(req, res, next){
  if(req.isAuthenticated() && res.locals.user.driver == 1 && res.locals.user.role == 'conductor'){
    next();
  } else {
    req.flash('error_msg','Inicia sesión como conductor');
    res.redirect('/');
  }
}



//Autenticacion
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/');
	}
}
// no cache funcion
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}




module.exports = router;