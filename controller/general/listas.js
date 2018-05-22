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

async function listaSeccciones() {

    try {
        let response = await sequelize.query('CALL lista_secciones()');
        console.log(response);
        winston.info("listaSeccciones success");
        return response;
    } catch(e) {
        winston.error("listaSeccciones Failed: ",e);
        return "error";
    }
}

async function listaMotivosAyudaEc() {

    try {
        let response = await sequelize.query('CALL lista_motivos()');
        console.log(response);
        winston.info("listaMotivosAyudaEc success");
        return response;
    } catch(e) {
        winston.error("listaMotivosAyudaEc Failed: ",e);
        return "error";
    }
}

async function listaEstadosAyudaEc() {

    try {
        let response = await sequelize.query('CALL lista_estados_ayuda_economica()');
        console.log(response);
        winston.info("listaEstadosAyudaEc success");
        return response;
    } catch(e) {
        winston.error("listaEstadosAyudaEc Failed: ",e);
        return "error";
    }
}

async function cicloActual(){
    try {
        let currentDate = new Date();
        console.log(currentDate);
        let day = currentDate.getDate();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();
        let response = await sequelize.query(`CALL encuentra_ciclo('${day}-${month}-${year}')`);
        console.log(response);
        winston.info("cicloActual success");
        return response[0].descripcion;
    } catch(e) {
        winston.error("cicloActual Failed: ",e);
        return "error";
    }
}

module.exports = {
    listaDocente: listaDocente,
    listaCiclos: listaCiclos,
    listaSeccciones: listaSeccciones,
    listaEstadosAyudaEc: listaEstadosAyudaEc,
    listaMotivosAyudaEc: listaMotivosAyudaEc,
    cicloActual: cicloActual
};