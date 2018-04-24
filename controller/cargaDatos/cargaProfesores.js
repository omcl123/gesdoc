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

async function cargaDocente(preferencesObject) {

    try {
        let result = {};
        winston.info("cargaDocente success on execution");
        return result;
    } catch(e) {
        winston.error("cargaDocente Failed: ",e);
    }
}

module.exports = {
    cargaDocente: cargaDocente
};