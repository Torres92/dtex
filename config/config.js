
//==========================
// PUERTO 
//=================
process.env.PORT = process.env.PORT || 3000;

//====================================
// MAILING
//============================


process.env.SENDGRID_API_KEY = process.env.SENDGRID_ENV //|| 'secret-de-desarrollo';

//==========================
// ENTORNO
//=================
//sino existe esta variable con || supongo que estoy en desarollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
// SEED de autenticación
//=================

process.env.SEED = process.env.SEED || 'secret-de-desarrollo';

//==========================
// Base de datos
//=================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
	urlDB ='mongodb://localhost:27017/dtexpress';	
}else {
	urlDB = process.env.MONGO_URI;
}



process.env.URLDB = urlDB;

