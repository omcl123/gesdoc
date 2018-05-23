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

async function asignaDocenteHorario(preferencesObject){
    try {
        let codigo = preferencesObject.codigoDocente;
        let codCurso = preferencesObject.codCurso;
        let numHorario = preferencesObject.numHorario;
        let horasAsignadas = preferencesObject.horasAsignadas;
        let ciclo = preferencesObject.ciclo;
        await sequelize.query(`call asignar_docente_horario(${codigo},'${codCurso}',${numHorario},${horasAsignadas},'${ciclo}');`);
        let esNuevoHorario = await sequelize.query(`call verifica_nuevo_horario('${codCurso}',${numHorario},'${ciclo}');`);
        if (esNuevoHorario[0].result === 0){
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
            await sequelize.query(`call lista_docente_encuesta_preferencia('${preferencesObject.codCurso}','${preferencesObject.ciclo}');`);
        let preferencia = Promise.all(await listapreferencia.map(async item =>{
            let partPref = {};
            partPref.codigo = item.codigo;
            partPref.nombre = item.nombre;
            partPref.encuesta =
                await (sequelize.query(`call devuelve_promedio_encuesta('${item.codigo}','${preferencesObject.codCurso}');`))[0].encuesta;
            return partPref;
        }));
        let listaGeneral =
            await sequelize.query(`call lista_docente_encuesta_general();`);
        let general = Promise.all(await listaGeneral.map(async item =>{
            let partPref = {};
            partPref.codigo = item.codigo;
            partPref.nombre = item.nombre;
            partPref.encuesta =
                await sequelize.query(`call devuelve_promedio_encuesta('${item.codigo}','${preferencesObject.codCurso}');`)[0].encuesta;
            return partPref;
        }));
        jsonBlock.preferencia = await preferencia;
        jsonBlock.general = await general;
        return jsonBlock;
    } catch (e){
        return "error";
    }
}

module.exports ={
    listaDocenteAsignar:listaDocenteAsignar,
    asignaDocenteHorario:asignaDocenteHorario
};