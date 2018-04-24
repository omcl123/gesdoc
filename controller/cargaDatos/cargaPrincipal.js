const winston = require('../../config/winston');
const cargaProfesores = require('./cargaProfesores');
const cargaCurso = require('./cargaCurso');
const cargaEncuestas = require('./cargaEncuestas');
const cargaInvestigacion = require('./cargaInvestigacion');
const cargaHorarios = require('./cargaHorarios');


async function cargaPrincipal(preferencesObject) {

    try {
        let result = {};
        if (preferencesObject.type === 'docentes') {
            result.message = await cargaProfesores.cargaDocente(preferencesObject);
        } else if (preferencesObject.type === 'cursos'){
            result.message = await cargaCurso.cargaCurso(preferencesObject);
        } else if (preferencesObject.type === 'encuestas'){
            result.message = await cargaEncuestas.cargaEncuestas(preferencesObject);
        } else if (preferencesObject.type === 'investigacion'){
            result.message = await cargaInvestigacion.cargaInvestigacion(preferencesObject);
        } else if (preferencesObject.type === 'horarios'){
            result.message = await cargaHorarios.cargaHorarios(preferencesObject);
        }
        winston.info("cargaPrincipal success on execution");

        return result;
    } catch(e) {
        winston.error("cargaPrincipal Failed: ",e);
        result.message = 'Error de carga';
        return result;
    }
}

module.exports = {
    cargaPrincipal: cargaPrincipal
};