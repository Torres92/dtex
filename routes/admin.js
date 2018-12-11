var express = require('express');
var router = express.Router();var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const users = require('../controllers/users');
const servicios = require('../controllers/services');
const pdf = require('../controllers/pdfService')
// CODE FOR GENERATING PDF
const pdfMake = require('pdfmake/build/pdfmake.js');
const vfsFonts = require('pdfmake/build/vfs_fonts.js');

pdfMake.vfs = vfsFonts.pdfMake.vfs;


const Service = require('../models/service');
var User = require('../models/user');

router.get('/pdfGenerator', servicios.pdfGenerator);

// Obteniendo Servicios ADMIN ROUTE
router.get('/', isAdmin, async (req, res, next) => {
  const services = await Service.find({"available": true});
  const dusers = await User.find({"role": "conductor"});
  const users = await User.find({"role": "empresa"});
  const allser = await Service.find({"available": false, "completed": false });
  const seFinished = await Service.find({"available": false, "completed": true });
  const length = services.length;
  const allserlength = allser.length;
  const dlength = dusers.length;
  const clength = users.length;
  const finlength = seFinished.length;
  res.render('./admin/admin', {
  	services,
  	dusers,
  	allser,
  	seFinished,
  	users,
  	length,
  	allserlength,
  	dlength,
  	clength,
  	finlength
  });

});



// Register User
router.post('/register/company', users.registerCompany);




// Register User
router.post('/register/driver', users.registerDriver);



passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

// Borrando un servicio
router.get('/register/driver', isAdmin, async (req, res)=> {
	res.render('./register/registerD');
});

// Borrando un servicio
router.get('/register/company', isAdmin, async (req, res)=> {
	res.render('./register/registerC');
});


// Borrando un servicio
router.get('/delete/:id', isAdmin, async (req, res)=> {
	const { id } = req.params;
	await Service.remove({_id: id});
	req.flash('success_msg', 'Servicio Borrado exitosamente');
	res.redirect('/admin');
});


router.post('/filter', isAdmin, servicios.filterServices);

// Borrando un usuario compañia o conductor
router.get('/udelete/:id', isAdmin, users.deleteUser); 

// Asignando un servicio a motorizado
router.post('/assign/:id', async (req, res)=> {
	const { id } = req.params;
	const driver = req.body.driver;
	const { dni } = await User.findOne({"name": driver});
	const service = await Service.findOne({_id: id});
	service.meta.driver = driver;
	service.meta.dni = dni;
	service.available = !service.available;
	await service.save();
	req.flash('success_msg', 'Servicio Asignado exitosamente');
	res.redirect('/admin');
}); 

// Desasignando un servicio a motorizado
router.get('/unassign/:id', async (req, res)=> {
	const { id } = req.params;
	const service = await Service.findOne({_id: id});
	service.meta.driver = null;
	service.meta.dni = null;
	service.available = !service.available;
	await service.save();
	req.flash('success_msg', 'Servicio Desasignado exitosamente');
	res.redirect('/admin');
}); 

// Añadiendo observacion y tomando sumatoria de precio
router.post('/obs/:id', async (req, res)=> {
	const { id } = req.params;
	const { comment } = req.body;
	const { raise } = req.body
	const charge = Number(raise).toFixed(2);
	const service = await Service.findOne({_id: id});
	service.comment.contenido = comment;
	service.comment.charge = charge;
	service.comment.newPrice = Number(charge + 10).toFixed(2);
	service.driverPrice.charge = Number(charge * 0.7).toFixed(2);
	service.driverPrice.total = (service.comment.newPrice * 0.7).toFixed(2); 
	await service.save();
   res.redirect('/admin');
});


// Obteniendo los servicios a nombre de una compañia
router.get('/services/:name', isAdmin, async (req, res)=> {
	const { name } = req.params;
	const dusers = await User.find({"role": "conductor"});
	const services = await Service.find({"meta.applicant": name});
	res.render('./admin/services', {
		services,
		dusers
	  });
});  

// Obteniendo los servicios a nombre de un o conductor
router.get('/service/:name', isAdmin, async (req, res)=> {
	const { name } = req.params;
	const services = await Service.find({"meta.driver": name});
	res.render('./admin/drivers', {
		services
	  });
});  


function isAdmin(req, res, next){
	if(req.isAuthenticated() && res.locals.user.admin == 1 && res.locals.user.role == 'administrador'){
		next();
	} else {
		req.flash('error_msg','Inicia sesión como administrador');
		res.redirect('/');
	}
}





//no cache funcion
function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}


module.exports = router;