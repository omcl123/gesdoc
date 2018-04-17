const db = 'dbiot';
const user = 'jjarenas26';
const password = 'jjarenas26';
const host = 'dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com';
const dialect = 'mysql';


function connect () {
	dbObj = {};
	dbObj.db = db;
	dbObj.user = user;
	dbObj.password = password;
	dbObj.host = host;
	dbObj.dialect = dialect;
	console.log(dbObj);
	return dbObj;
}
	
module.exports ={
	connect: connect
}