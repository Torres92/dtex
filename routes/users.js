var express = require('express');
var router = express.Router();





router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'Has cerrado sesión correctamente');

	res.redirect('/');
});


module.exports = router;