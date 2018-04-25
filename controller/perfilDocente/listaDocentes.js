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

async function listaDocente() {

    try {
        let response = await sequelize.query('CALL listaDocentes()');
        console.log(response);
        winston.info("muestraCursosCiclo success");
        return response;
    } catch(e) {
        winston.error("muestraCursosCiclo Failed: ",e);
        return "error";
    }
}

async function listaCiclos() {

    try {
        let response = await sequelize.query('CALL listaCiclos()');
        console.log(response);
        winston.info("listaCiclos success");
        return response;
    } catch(e) {
        winston.error("listaCiclos Failed: ",e);
        return "error";
    }
}

module.exports = {
    listaDocente: listaDocente,
    listaCiclos: listaCiclos
};