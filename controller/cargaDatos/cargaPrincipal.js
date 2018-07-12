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
async function nuevaEncuesta(preferencesObject){
    try{
        let id_horario_profesor =preferencesObject.id_horario_profesor;
        let puntaje = id_horario_profesor.puntaje;
        let comentario = id_horario_profesor.comentario;

        if (id_horario_profesor === undefined || puntaje === undefined || comentario === undefined){
            return message = "cargaCurso Failed undefined or empty columns";
        }else{

            await sequelize.query(`CALL insert_encuesta ('${id_horario_profesor}', '${puntaje}', '${comentario}')`);

            return message = "cargaEncuesta  success on execution";
        } 
    }catch(e){
        return message = "Ha ocurrido un error";
    }
}
async function nuevoHorario(preferencesObject){
    try{
        let codigoProf = preferencesObject.codigo_profesor;
        let participacion =preferencesObject.participacion;
        let puntaje = preferencesObject.puntaje;
        let codigoCurso = preferencesObject.codigo_curso;
        let ciclo = preferencesObject.ciclo;
        let codigoHorario = preferencesObject.codigo_horario;

        if (codigoProf === undefined || codigoCurso === undefined || ciclo === undefined
            || codigoHorario === undefined ){
            return message = "cargaHorarios Failed undefined or empty columns";
        }else{

            let esRepetido = await sequelize.query(`CALL verifica_curso_ciclo_repetido ('${codigoCurso}', '${ciclo}')`);

            if (esRepetido[0] === undefined) {
                await sequelize.query(`CALL insert_curso_ciclo ('${codigoCurso}', '${ciclo}')`);
                winston.info("cargaHorarios insert new cursoxciclo success on execution");
            }

            //verifica horario duplicado
            let horario_esRepetido = await sequelize.query(`CALL verifica_horario_duplicado ('${codigoCurso}', '${ciclo}','${codigoHorario}')`);


            if (horario_esRepetido[0] === undefined) {
                await sequelize.query(`CALL insert_horario (${codigoProf}, '${codigoCurso}', '${ciclo}',
                '${codigoHorario}', ${participacion}, ${puntaje})`);

                winston.info("Horarios insert new insert_horario success on execution");
            }else{
                await sequelize.query(`CALL insert_horario_profesor (${codigoProf}, '${codigoCurso}', '${ciclo}',
                '${codigoHorario}', ${participacion}, ${puntaje})`);
            }

            return message = "cargaHorarios  success on execution";
        }
    }catch (e) {
        winston.error("cargaHorarios Failed: ",e);
        message = "cargaHorarios Failed";
        return message;
    }    
}    
module.exports = {
    cargaPrincipal: cargaPrincipal,
    nuevoCurso:nuevoCurso,
    nuevoDocente:nuevoDocente,
    nuevaEncuesta:nuevaEncuesta,
    nuevoHorario:nuevoHorario
};