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


function searchCourses(preferencesObject,tipo) {

    return sequelize.query('CALL cursoXcicloXprofesor (:codigo, :ciclo, :tipo)',
            {replacements: { codigo: preferencesObject.codigo, ciclo: preferencesObject.ciclo, tipo }});
}



async function muestraCursoCiclo(preferencesObject) {

    try {

        let arrayTipo = ["pregrado", "posgrado", "otros"];
        let arrayCursos = Promise.all(arrayTipo.map(async item => {
            try{
                let innerPart = {};
                innerPart.tipo = item;
                let listaCursos = await searchCourses(preferencesObject,innerPart.tipo);
                innerPart.listaCursos = listaCursos;
                return innerPart;
            }catch (e){

            }

        }));
        winston.info("muestraCursosCiclo success");
        return arrayCursos;
    } catch(e) {
        winston.error("muestraCursosCiclo Failed: ",e);
        return "error";
    }
}

module.exports = {
    muestraCursoCiclo: muestraCursoCiclo
};