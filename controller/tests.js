var winston = require('../config/winston');
const dbCon = require('../config/db');
const Sequelize = require('sequelize');
const dbSpecs =  dbCon.connect();
const sequelize = new Sequelize(dbSpecs.db, dbSpecs.user, dbSpecs.password, {
	host: dbSpecs.host,
	dialect: dbSpecs.dialect,
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
		winston.info("devuelveTabla succesful");
		return jsonBlock;
	} catch (e){
		console.log(e);
		winston.error("devuelveTabla failed");
	}
}

module.exports = {
	devuelveTabla: devuelveTabla
}