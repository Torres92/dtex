var express = require('express');
var router = express.Router();var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const services = require('../controllers/services');

var User = require('../models/user');
const Service = require('../models/service');



// Obteniendo Servicios COMPANY ROUTE
router.get('/', isCompany, nocache, async (req, res, next) => {
  const { name } = res.locals.user;
  try {
    const services = await Service.find({"meta.applicant": name, "available": true}).sort({"date.request": -1});
    const seInProcess = await Service.find({"meta.applicant": name, "available": false, "completed": false }).sort({"date.request": -1});
    const seFinished = await Service.find({"meta.applicant": name, "available": false, "completed": true }).sort({"date.request": -1});
    const selength = services.length;
    const proclength = seInProcess.length
    const finlength = seFinished.length;
    res.render('./company/company',{
      services,
      seInProcess,
      seFinished,
      selength,
      proclength,
      finlength
    });
  } catch(e) {
    console.log(e);
    req.flash('error_msg', 'Ha ocurrido un error con la base de datos');
    res.render('./404');
  }
});

router.get('/allservices/:name', isCompany, async (req, res) =>{
  const { name } = req.params;
  const seFinished = await Service.find({"meta.applicant": name, "available": false, "completed": true }).sort({"date.request": -1});
  res.render('./company/services', {
    seFinished
  });
});

router.post('/filter', isCompany, async (req, res) =>{
  var { startDay, currentMonth, lastDay, lastMonth, company} = req.body;
  console.log(startDay, currentMonth, lastDay, lastMonth, company);

  var filteredServices = [];
  try{
      var services = await Service.find({'meta.applicant': company, 'completed': true}).sort({"date.request": -1});
    } catch(e){
      console.log(e);
      req.flash('error_msg', 'Ha ocurrido un error generando los servicios');
      res.redirect('./company');
    }

      var startDay = Number(startDay);
      var lastDay = Number(lastDay);

      if (startDay > lastDay) {

        for (var i = services.length - 1; i >= 0; i--) {
                      if((services[i].date.day >= startDay && services[i].date.month == currentMonth) || (services[i].date.day <= lastDay && services[i].date.month == lastMonth ))
                      {
                     filteredServices.push(services[i]);
                      } 
                  }
      }
      if (startDay < lastDay) {
          for (var i = services.length - 1; i >= 0; i--) {
                      if((services[i].date.day >= startDay && services[i].date.month >= currentMonth) && (services[i].date.day <= lastDay && services[i].date.month <= lastMonth ))
                      {
                     filteredServices.push(services[i]);
                      } 
                  } 
      }
      if (startDay == lastDay) {
          for (var i = services.length - 1; i >= 0; i--) {
                      if((services[i].date.day >= startDay && services[i].date.month >= currentMonth) && (services[i].date.day <= lastDay && services[i].date.month <= lastMonth ))
                      {
                     filteredServices.push(services[i]);
                      } 
                  } 
      } 

      console.log(filteredServices);
      res.render('./company/services', {
        filteredServices,
        });

});


// Obteniendo Servicios COMPANY ROUTE
router.get('/add', isCompany, (req, res, next) => {
  res.render('./company/service');

});

// Solicitando servicios
router.post('/add/:name', services.createService);

// Borrando un servicio
router.get('/delete/:id', isCompany, async (req, res)=> {
  const { id } = req.params;
  await Service.remove({_id: id});
  res.redirect('/company');
});

function isCompany(req, res, next){
  if(req.isAuthenticated() && res.locals.user.company == 1 && res.locals.user.role == 'empresa'){
    next();
  } else {
    req.flash('error_msg','Inicia sesión como compañia');
    res.redirect('/');
  }
}


//authentication
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
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