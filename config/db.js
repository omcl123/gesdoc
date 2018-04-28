const db = 'dbsw';
const user = 'root';
const password = 'kairosdb';
const host = 'localhost';
const dialect = 'mysql';


function connect () {
	dbObj = {};
	dbObj.db = db;
	dbObj.user = user;
	dbObj.password = password;
	dbObj.host = host;
	dbObj.dialect = dialect;
	return dbObj;
}
	
module.exports = {
	connect: connect
};