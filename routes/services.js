var express = require('express');
var router = express.Router();



router.post('/services', (req, res)=>{
	console.log(req.body);
	res.send('recibido');
});



module.exports = router;