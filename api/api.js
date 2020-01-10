
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');


// Init App
var app = express();


//dev middleware
app.use(morgan('dev'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.use('/api/v1', require('./routes/api_V1'))


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
	console.log('Server started on port '+app.get('port'));
});