const Sequelize = require('sequelize');
const db = 'dbiot';
const user = 'jjarenas26';
const password = 'jjarenas26';
const host = 'dbiot.clnhdetlnsuw.us-east-1.rds.amazonaws.com';
const dialect = 'mysql';

const sequelize = new Sequelize(db, user, password, {
  host: host,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});


function queryDb() {
	let query = `SELECT * from ventas`;
    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}

async function devuelveTabla() {
	let jsonBlock = {};
	try {
		let jsonBlock = await queryDb();
		return jsonBlock;
	} catch (e){
		console.log(e);
	}
}

module.exports = {
	devuelveTabla: devuelveTabla
}