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

async function cargaInvestigacion(preferencesObject) {

    try {
        let result = {};
        winston.info("cargaInvestigacion success on execution");
        return result;
    } catch(e) {
        winston.error("cargaInvestigacion Failed: ",e);
    }
}

module.exports = {
    cargaInvestigacion: cargaInvestigacion
};