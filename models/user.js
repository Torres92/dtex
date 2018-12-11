const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let validRole = {
	values: ['administrador', 'empresa', 'conductor'],
	message: '{VALUE} no es un rol válido'
}


// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	dni: {
		type: Number,
		required: false
	},
	tlf: {
		type: String
	},
	ruc: {
		type: Number,
		required: false
	},
	admin: {
		type: Number
	},
	company: {
		type: Number
	},
	driver: {
		type: Number
	},
	role: {
		type: String,
		enum: validRole
	},
	available: {
		type: Boolean,
		default: true
	}
});



var User = module.exports = mongoose.model('User', UserSchema);


module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	username.toLowerCase();
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}