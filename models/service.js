const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Service Schema
const ServiceSchema = new Schema({
	// fecha de peticion del servicio
	date: { 
		request: Date,
		month: Number,
		day: Number,
		formattedDate: {
				type: String
			}
	},
	
	ori: {
		type: String,
		required: [true, 'El lugar de recojo es necesario']
	},
	oriName: {
		type: String,
		required: [true, 'Se requiere un nombre para emiso']
	},
	oriTlf:{
		type: String,
		required: [true, 'Se requiere un tlf para emisor']
	},
	dest: {
		type: String,
		required: [true, 'El lugar de destino es necesario']
	},
	destName: {
		type: String,
		required: [true, 'Se requiere un nombre para receptor']
	},
	destTlf: {
		type: String,
		required: [true, 'Se requiere un tlf para receptor']
	},
	desc: {
		type: String,
		required: [true, 'El servicio debe llevar observaciones']
	},
	//cambia cuando se recoge
	status: {
		hora: Date,
		type: Boolean,
		default: true
	},// Boolean
	// cambia cuando se entrega
	completed: {
		type: Boolean,
		default: false
	},
	//fecha en q se toma, fecha en que se entrega, nombre solicitante, nombre conductor, dni conductor y formateado
	meta:{
		taken: Date,
		deliver: Date,
		applicant: String,
		driver: String,
		dni: String,
		hrRe: String,
		hrEn: String
	},
	// observacion agregada y recarga por observacion
	comment: {
		contenido: String,
		charge: {
			type: Number,
			default: 0.00,
		},
		newPrice: {
			default: 10.00,
			type: Number
		}
	},
	// siempre sera s/10
	price: {
		type: Number,
		default: 10.00
	},
	driverPrice: {
		basic: {
			default: 7.00,
			type: Number
		},
		charge: {
			type: Number,
			default: 0.00
		},
		total: {
			type: Number,
			default: 7.00
		}
	},
	// cambia cuando se asigna
	available: {
		type: Boolean,
		default: true
	}
	

});

module.exports = mongoose.model('Services', ServiceSchema);

