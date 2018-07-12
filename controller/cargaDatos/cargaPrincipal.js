const winston = require('../../config/winston');
const cargaProfesores = require('./cargaProfesores');
const cargaCurso = require('./cargaCurso');
const cargaEncuestas = require('./cargaEncuestas');
const cargaHorarios = require('./cargaHorarios');
const cargaAsignacion = require('./cargaAsignacionHorarios');
const cargaDepartamentos = require('./cargaDepartamento');

async function cargaPrincipal(preferencesObject) {

    try {
        let result = {};
        if (preferencesObject.type === 'docentes') {
            result.message = await cargaProfesores.cargaDocente(preferencesObject.data);
        } else if (preferencesObject.type === 'cursos'){
            result.message = await cargaCurso.cargaCurso(preferencesObject.data);
        } else if (preferencesObject.type === 'encuestas'){
            result.message = await cargaEncuestas.cargaEncuestas(preferencesObject.data);
        } else if (preferencesObject.type === 'horarios'){
            result.message = await cargaHorarios.cargaHorarios(preferencesObject.data);
        } else if (preferencesObject.type === 'asignacionHorarios'){
            result.message = await cargaAsignacion.cargaAsignacionHorarios(preferencesObject.data);
        } else if (preferencesObject.type === 'departamentos'){
            result.message = await cargaDepartamentos.cargaDepartamentos(preferencesObject.data);
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