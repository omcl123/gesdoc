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

function searchCourses(preferencesObject) {
    let codigo = preferencesObject.codigo;
    let ciclo = preferencesObject.ciclo;

    return sequelize.query('CALL cursoXcicloXprofesor (:codigo, :ciclo)',
            {replacements: { codigo: codigo, ciclo: ciclo }});
}

async function processCursos(preferencesObject, queryResponse) {
    let jsonBlock = {};

    jsonBlock.codigo = preferencesObject.codigo;
    jsonBlock.curso = preferencesObject.curso;

    jsonBlock.courses = await Promise.all(queryResponse.map((item) => {
        let part = {};

        part.codCur = item.codCur;
        part.nomCur = item.nomCur;
        part.horCur = item.horCur;
        part.numCred = item.numCred;
        part.horaCurso = item.horaCurso;

        return part;
    }));
    return jsonBlock;
}

async function muestraCursoCiclo(preferencesObject) {

    try {
        let queryResponse = await searchCourses(preferencesObject);
        let jsonBlock = await processCursos(preferencesObject, queryResponse);
        winston.info("muestraCursosCiclo success on execution");
        return jsonBlock;
    } catch(e) {
        winston.error("muestraCursosCiclo Failed: ",e);
    }
}

module.exports = {
    muestraCursoCiclo: muestraCursoCiclo
};