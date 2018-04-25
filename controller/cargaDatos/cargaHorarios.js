const winston = require('../../config/winston');
const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect();
const sequelize= new Sequelize(dbSpecs.db, dbSpecs.user, dbSpecs.password, {
    host: dbSpecs.host,
    dialect: dbSpecs.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

async function cargaHorarios(preferencesObject) {

    try {
        let result = {};
        winston.info("cargaHorarios success on execution");
        return result;
    } catch(e) {
        winston.error("cargaHorarios Failed: ",e);
    }
}

module.exports = {
    cargaHorarios: cargaHorarios
};