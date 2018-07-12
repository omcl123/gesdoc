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

async function nuevoCurso(preferencesObject){
    try {
        let codigo = preferencesObject.codigo;
        let nombre =preferencesObject.nombre;
        let creditos = preferencesObject.creditos;
        let horasDictado = preferencesObject.horasDictado;
        let facultad = preferencesObject.facultad;
        let seccion = preferencesObject.seccion;
        let tipoCurso = preferencesObject.tipoCurso;
        let tipoClase = preferencesObject.tipoClase;
        if (nombre === undefined || codigo === undefined || creditos === undefined|| horasDictado === undefined
            || facultad === undefined|| seccion === undefined|| tipoCurso === undefined|| tipoClase === undefined){
            return message = "cargaCurso Failed undefined or empty columns";
        }else{
            let esRepetido = await sequelize.query(`CALL verifica_curso_repetido ('${codigo}')`);

            if (esRepetido[0] === undefined) {
                await sequelize.query(`CALL insert_curso ( '${codigo}','${nombre}', ${creditos},
                        ${horasDictado}, '${facultad}', '${seccion}', '${tipoCurso}','${tipoClase}')`);
            }
            return message = "cargaCurso success on execution";
        }
    }catch (e) {

    }
}

async function nuevoDocente(preferencesObject){
    try {
        let nombre = preferencesObject.nombre;
        let apellidoP = preferencesObject.apellidoP;
        let apellidoM = preferencesObject.apellidoM;
        let dni = preferencesObject.dni;
        let telefono = preferencesObject.telefono;
        let email = preferencesObject.email;
        let seccion = preferencesObject.seccion;
        let tipo = preferencesObject.tipo;
        let codigo = preferencesObject.codigo;
        let password = bcrypt.hashSync(preferencesObject.password, 8);
        if (nombre === undefined || apellidoP === undefined || apellidoM === undefined|| dni === undefined
            || telefono === undefined|| seccion === undefined|| tipo === undefined|| email === undefined
            || codigo === undefined || password){
            return message = "cargaDocente Failed undefined or empty columns";
        }else{
            let esRepetido = await sequelize.query(`CALL verifica_docente_repetido (${codigo})`);

            if (esRepetido[0] === undefined) {
                await sequelize.query(`CALL insert_docente ('${nombre}', '${apellidoP}', '${apellidoM}',
                        ${dni}, ${telefono}, '${email}', '${seccion}', '${tipo}',${codigo},'${password}')`);
            }
            return message = "cargaDocente success on execution";
        }
    }catch (e) {
        
    }
}

module.exports = {
    cargaPrincipal: cargaPrincipal,
    nuevoCurso:nuevoCurso,
    nuevoDocente:nuevoDocente
};