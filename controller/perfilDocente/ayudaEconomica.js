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

async function listaAyudas(preferencesObject) {

    try {


        winston.info("listaAyudas success");
        return arrayCursos;
    } catch(e) {
        winston.error("listaAyudas Failed: ",e);
        return "error";
    }
}

module.exports = {
    listaAyudas: listaAyudas
};