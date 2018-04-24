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

function listaCiclos() {
    return sequelize.query('CALL cixclosVigentes()'):
}

function searchCourses(codigo, ciclo) {
    return sequelize.query('CALL cursoXcicloXprofesor (:codigo, :ciclo)',
            {replacements: { codigo: codigo, ciclo: ciclo }});
}



async function muestraCursoCiclo(preferencesObject) {

    try {
        let ciclosVigentes = await listaCiclos();
        let detalleCursos = await Promise.all(ciclosVigentes.map(async item => {
            return await searchCourses(preferencesObject.codigo, item.ciclo);
        }));
        winston.info("muestraCursosCiclo success on execution");
        return detalleCursos;
    } catch(e) {
        winston.error("muestraCursosCiclo Failed: ",e);
    }
}

module.exports = {
    muestraCursoCiclo: muestraCursoCiclo
};