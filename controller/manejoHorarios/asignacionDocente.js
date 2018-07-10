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


async function eliminaDocenteHorario(preferencesObject){
    try {
        let codigo = preferencesObject.codigoDocente;
        let codCurso = preferencesObject.codCurso;
        let numHorario = preferencesObject.numHorario;
        let ciclo = preferencesObject.ciclo;
        await sequelize.query(`call elimina_docente_horario(${codigo},'${codCurso}',${numHorario},'${ciclo}');`);
        return "success";
    }catch (e){
        return "error";
    }
}

async function actualizaDocenteHorario(preferencesObject){
    try {
        let codigo = preferencesObject.codigoDocente;
        let codCurso = preferencesObject.codCurso;
        let numHorario = preferencesObject.numHorario;
        let horasAsignadas = preferencesObject.horasAsignadas;
        let ciclo = preferencesObject.ciclo;
        await sequelize.query(`call actualiza_docente_horario(${codigo},'${codCurso}',${numHorario},${horasAsignadas},'${ciclo}');`);
        return "success";
    }catch (e){
        return "error";
    }
}


async function asignaDocenteHorario(preferencesObject){
    try {
        let codigo = preferencesObject.codigoDocente;
        let codCurso = preferencesObject.codCurso;
        let numHorario = preferencesObject.numHorario;
        let horasAsignadas = preferencesObject.horasAsignadas;
        let ciclo = preferencesObject.ciclo;
        await sequelize.query(`call asignar_docente_horario(${codigo},'${codCurso}',${numHorario},${horasAsignadas},'${ciclo}');`);
        let esNuevoHorario = await sequelize.query(`call verifica_nuevo_horario('${codCurso}',${numHorario},'${ciclo}');`);
        console.log(esNuevoHorario[0]);
        if (esNuevoHorario[0].result === 1){
            await sequelize.query(`call asigna_nuevo_horario('${codCurso}','${ciclo}');`);
        }
        return "success";
    }catch (e){
        return "error";
    }
}

async function listaDocenteAsignar(preferencesObject) {
    try {
        let jsonBlock = {};
        let listapreferencia =
            await sequelize.query(`call lista_docente_encuesta_preferencia('${preferencesObject.codCur}','${preferencesObject.ciclo}');`);
        let preferencia = Promise.all(await listapreferencia.map(async item =>{
            let partPref = {};
            partPref.codigo = item.codigo;
            partPref.nombre = item.nombre;
            partPref.tipo = item.tipo;
            let resumenCargaDocente =
                await sequelize.query(`call resumen_carga_docente('${item.codigo}','${preferencesObject.ciclo}');`);
            partPref.numCursos = await resumenCargaDocente[0].numCursos;
            if (partPref.numCursos === 0){
                partPref.horasAsignadas = 0;
            }else{
                partPref.horasAsignadas = resumenCargaDocente[0].horasAsignadas;
            }
            let encuesta =
                await (sequelize.query(`call devuelve_promedio_encuesta('${item.codigo}','${preferencesObject.codCur}');`));
            if (await encuesta > 0){
                partPref.encuesta = encuesta[0].encuesta;
            }else{
                partPref.encuesta = "-";
            }
            return partPref;
        }));
        let listaGeneral =
            await sequelize.query(`call lista_docente_encuesta_general();`);
        let general = Promise.all(await listaGeneral.map(async item =>{
            let partPref = {};
            partPref.codigo = item.codigo;
            partPref.nombre = item.nombre;
            partPref.tipo = item.tipo;
            let resumenCargaDocente =
                await sequelize.query(`call resumen_carga_docente('${item.codigo}','${preferencesObject.ciclo}');`);
            if (resumenCargaDocente[0].numCursos === null){
                partPref.numCursos = 0;
            } else{
                partPref.numCursos = resumenCargaDocente[0].numCursos;
            }

            if (partPref.numCursos === 0){
                partPref.horasAsignadas = 0;
            }else{
                partPref.horasAsignadas = resumenCargaDocente[0].horasAsignadas;
            }
            let encuesta =
                await sequelize.query(`call devuelve_promedio_encuesta('${item.codigo}','${preferencesObject.codCur}');`);
            if (await encuesta > 0){
                partPref.encuesta = encuesta[0].encuesta;
            }else{
                partPref.encuesta = "-";
            }
            return partPref;
        }));
        jsonBlock.preferencia = await preferencia;
        jsonBlock.general = await general;
        return jsonBlock;
    } catch (e){
        return "error";
    }
}

async function insertaNuevoHorarioCurso(preferencesObject,res){
    try {
        let response = await
            sequelize.query
            (`CALL get_num_horarios_id ( '${preferencesObject.curso}','${preferencesObject.ciclo}')`);
        let horarios = response[0].horarios_disponibles;
        let id = response[0].id;
        let newResponse = await sequelize.query
        (`CALL insert_asignacion_horario ( '${preferencesObject.curso}','${preferencesObject.ciclo}',${horarios},${id})`);
        res.status(200).send({"num_horarios":newResponse[0].horarios_disponibles});
    }catch (e) {
        res.status(500).send({"error":"ocurrio un error"});
    }
}

async function eliminaHorarioCurso(preferencesObject,res){
    try {
        await
            sequelize.query
            (`CALL elimina_asignacion_horario ( '${preferencesObject.curso}','${preferencesObject.ciclo}',${preferencesObject.horEli})`);
        res.status(200).send({"success":true});
    }catch (e) {
        res.status(500).send({"error":"ocurrio un error"});
    }
}

async function exportaAsignacion(preferencesObject,res){
    try {
        let jsonBlock={};
        let arraycursos = await sequelize.query(`call lista_cursos_disponible('${preferencesObject.ciclo}');`);
        console.log(arraycursos);
        let finalArray = Promise.all(await arraycursos.map(async item =>{

                let innerPart={};
                innerpart.seccion = item.seccion;
                innerpart.codigo = item.codigo;
                innerpart.nombre = item.nombre;
                innerpart.creditos = item.codigo;
                innerpart.horas = item.codigo;
                innerpart.horarios_disponibles = item.horarios_disponibles;
                innerpart.horarios_asignados = item.horarios_asignados;

                let numHorarios = await
                    sequelize.query(`call lista_horarios_curso_disponible('${item.codigo}','${preferencesObject.ciclo}');`);

                let docentes= Promise.all(await numHorarios.map(async part => {

                        let partHorarios = {};
                        partHorarios.numHorario = part.num_horario;
                        partHorarios.docentesInscritos =
                            await sequelize.query(`call docentes_inscritos_horario('${item.codigo}','${preferencesObject.ciclo}',${part.num_horario});`);
                        return partHorarios;

                }));
                innerPart.docentes = await docentes;
                return innerPart;

        }));
        jsonBlock.lista = await finalArray;
        return jsonBlock;
    }catch (e) {
        return e;
    }
}

module.exports ={
    listaDocenteAsignar:listaDocenteAsignar,
    asignaDocenteHorario:asignaDocenteHorario,
    actualizaDocenteHorario:actualizaDocenteHorario,
    eliminaDocenteHorario:eliminaDocenteHorario,
    insertaNuevoHorarioCurso:insertaNuevoHorarioCurso,
    eliminaHorarioCurso:eliminaHorarioCurso,
    exportaAsignacion:exportaAsignacion
};