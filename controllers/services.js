var User = require('../models/user');
const Service = require('../models/service');
const pdf = require('./pdfService');
const pdfMake = require('pdfmake/build/pdfmake.js');
const vfsFonts = require('pdfmake/build/vfs_fonts.js');
require('../config/config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																									

exports.createService = async (req, res) => {

			const { name } = req.params;
			const service = new Service(req.body);
    		/*var email;
    		recipients = [];
			const adminusers = await User.find({"admin": 1});
			const driverusers = await User.find({"driver": 1});
			console.log(recipients, adminusers, driverusers);
			for (var i = adminusers.length - 1; i >= 0; i--) {
				recipients.push({"email" : `${adminusers[i].email}`});
			}
			for (var i = driverusers.length - 1; i >= 0; i--) {
				recipients.push({"email" : `${driverusers[i].email}`});
			}
			console.log(recipients);*/
    		service.meta.applicant = name;
			var request = new Date();
			var weekday = request.getDay();
			var month = request.getMonth();
			var month = month + 1;
			var year = request.getFullYear();
			var day = request.getDate();
			var notHour = request.getHours();
			if( notHour < 5){
			  var hour = notHour + 19;
			}else {
			  var hour = notHour - 5;
			}	
			var min = request.getMinutes();
			if (weekday < 10) {
				weekday = '0' + weekday;
			}
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
			const formattedDate = day + '/' + month + '/' + year + ' - ' + hour + ':' + min; 
			service.date.request = request;
			service.date.formattedDate = formattedDate;
			service.date.day = day;
			service.date.month = month;


			await service.save();

			req.flash('success_msg', 'Servicio solicitado exitosamente');


			
			const msg = {
				  "to": [{
						"email": "aleph2445@gmail.com"
					}, {
						"email": "valverderichard92@gmail.com"
					}, {
						"email": "recipient3@example.com"
					}],
				  from: 'aleph2445@gmail.com',
				  subject: 'NUEVA SOLICITUD DE SERVICIOS',
				  text: 'and easy to do anywhere, even with Node.js',
				  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
			};
			sgMail.send(msg);
			console.log('message sent');
			res.redirect('/company');
}


exports.filterServices = async (req, res, next)=> {
	var { startDay, currentMonth, lastDay, lastMonth, company, driver } = req.body;
	
	this.startDay = undefined;
	this.currentMonth = undefined;
	this.lastDay = undefined;
	this.lastMonth = undefined
	this.driver = undefined;
	this.company = undefined;
	this.dates = [];
	this.filteredServices = [];
	// company logic
	if(company){
	var services = await Service.find({'meta.applicant': company, 'completed': true}).sort({"date.request": -1});
	var startDay = Number(startDay);
	var lastDay = Number(lastDay);
	this.dates.push(startDay);
	this.dates.push(lastDay);
	this.dates.push(currentMonth);
	this.dates.push(lastMonth);
	this.company = company;
	this.dates.push(company);

	console.log('company', startDay, currentMonth, lastDay, lastMonth);
	if (startDay > lastDay) {
	console.log('startDay > lastDay');	
		for (var i = services.length - 1; i >= 0; i--) {
	                if((services[i].date.day >= startDay && services[i].date.month == currentMonth) || (services[i].date.day <= lastDay && services[i].date.month == lastMonth ))
	                {
	         		   this.filteredServices.push(services[i]);
	                } 
	            }
	}
	if (startDay < lastDay) {
		console.log('startDay < lastDay');
			for (var i = services.length - 1; i >= 0; i--) {
	                if((services[i].date.day >= startDay && services[i].date.month >= currentMonth) && (services[i].date.day <= lastDay && services[i].date.month <= lastMonth ))
	                {
	         		   this.filteredServices.push(services[i]);
	                } 
	            }	
	}
	if (startDay == lastDay) {
		console.log('startDay = lastDay');
			for (var i = services.length - 1; i >= 0; i--) {
	                if((services[i].date.day >= startDay && services[i].date.month >= currentMonth) && (services[i].date.day <= lastDay && services[i].date.month <= lastMonth ))
	                {
	         		   this.filteredServices.push(services[i]);
	                } 
	            }	
	}	
	  filteredServices = this.filteredServices;
	res.render('./admin/services', {
		filteredServices,
	  });
	}

	// driver logic
	if(driver){
		var services = await Service.find({'meta.driver': driver, 'completed': true}).sort({"date.request": -1});
		this.startDay = Number(startDay);
		this.lastDay = Number(lastDay);
		this.dates.push(startDay);
		this.dates.push(lastDay);
		this.dates.push(currentMonth);
		this.dates.push(lastMonth);
		this.driver = driver;
		this.dates.push(driver);


		for (var i = services.length - 1; i >= 0; i--) {
	        if((services[i].date.day >= startDay && services[i].date.month == currentMonth) || (services[i].date.day <= lastDay && services[i].date.month == lastMonth ))
	            {
	       		   this.filteredServices.push(services[i]);
	            } 
	        }

		  filteredServices = this.filteredServices;

		res.render('./admin/services', {
			filteredServices,
		  });
	}
}

exports.pdfGenerator = async (req, res, next) => {
	var startDay = this.dates[0];
	var lastDay = this.dates[1];
	var currentMonth = this.dates[2];
	var lastMonth = this.dates[3];
	if(this.company){
		var company = this.company;
	}
	if(this.driver){
		var driver = this.driver;
	}
	const documentDefinition = pdf.createPDF(filteredServices, startDay,lastDay, currentMonth, lastMonth, company, driver);
	const pdfDoc = pdfMake.createPdf(documentDefinition);
        
        pdfDoc.getBase64((data)=>{
            res.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition':'attachment;filename="reporte-semanal.pdf"'
            });

            const download = Buffer.from(data.toString('utf-8'), 'base64');
            res.end(download);
        })


}