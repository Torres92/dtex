const mongo = require('mongodb');
const mongoose = require('mongoose');
require('./config/config');


let configt = {
	useCreateIndex: true,
	userNewUrlParser: true,
	useFindAndModify:false
}

mongoose.connect(process.env.URLDB, (err, res)=>{

  if( err ) throw err;

  console.log('BASE de datos ONLINE')
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});
