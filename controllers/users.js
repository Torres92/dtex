var User = require('../models/user');

exports.registerCompany = (req, res) => {
	var name = req.body.name.toLowerCase();
	var username = req.body.username.toLowerCase();
	var ruc = req.body.ruc;
	var tlf = req.body.tlf;
	var email = req.body.email.toLowerCase();
	var role = req.body.role.toLowerCase();
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'El nombre de la Compañia es requerido').notEmpty();
	req.checkBody('email', 'El correo requerido').notEmpty();
	req.checkBody('email', 'El correo no es valido').isEmail();
	req.checkBody('role', 'Role is required').notEmpty();
	req.checkBody('username', 'Es requerido un Nombre de Usuario').notEmpty();
	req.checkBody('ruc', 'El RUC es requerido').notEmpty();
	req.checkBody('ruc', 'El RUC debe ser un número').isNumeric();
	req.checkBody('tlf', 'El numero de telefono es requerido').notEmpty();
	req.checkBody('tlf', 'El tlf debe ser un número').isNumeric();
	req.checkBody('password', 'Contraseña requerida').notEmpty();
	req.checkBody('password2', 'Las contraseñas no coinciden').equals(req.body.password);

	var errors = req.validationErrors();
	if (errors) {
	 console.log(errors);
		res.render('./register/registerC', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('./register/registerC', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						role: role,
						username: username,
						password: password,
						ruc: ruc,
						tlf: tlf,
						admin: 0,
						company: 1,
						driver: 0
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         		req.flash('success_msg', 'Registro exitoso');
					res.redirect('/admin');
				}
			});
		});
	}
}

exports.registerDriver = (req, res) => {
	var name = req.body.name.toLowerCase();
	var username = req.body.username.toLowerCase();
	var dni = req.body.dni;
	var tlf = req.body.tlf;
	var email = req.body.email.toLowerCase();
	var role = req.body.role.toLowerCase();
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'El nombre es requerido').notEmpty();
	req.checkBody('email', 'El correo es requerido').notEmpty();
	req.checkBody('email', 'El correo es inválido').isEmail();
	req.checkBody('role', 'El rol es requerido').notEmpty();
	req.checkBody('username', 'Nombre de usuario es requerido').notEmpty();
	req.checkBody('dni', 'Dni es necesario').notEmpty();
	req.checkBody('dni', 'Dni debe ser un número').isNumeric();
	req.checkBody('tlf', 'Telefono es requerido').notEmpty();
	req.checkBody('tlf', 'El tlf debe ser un número').isNumeric();
	req.checkBody('password', 'La Contraseña es requerida').notEmpty();
	req.checkBody('password2', 'La contraseñas no coinciden').equals(password);

	var errors = req.validationErrors();



	if (errors) {
		res.render('./register/registerD', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('./register/registerD', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						role: role,
						username: username,
						password: password,
						dni: dni,
						tlf: tlf,
						admin: 0,
						driver: 1,
						company: 0
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         		req.flash('success_msg', 'Registro exitoso');
					res.redirect('/admin');
				}
			});
		});
	}
}

exports.deleteUser = async (req, res)=> {
	const { id } = req.params;
	await User.remove({_id: id});
	req.flash('success_msg', 'Usuario Borrado exitosamente');
	res.redirect('/admin');
}