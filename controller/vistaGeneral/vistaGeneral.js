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


async function docentesTipoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL docentes_tipo_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}

async function actividadesTipoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL actividades_tipo_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoEstadoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL ayuda_economica_estado_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}

async function convocatoriaEstadoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL convocatoria_estado_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}


async function docentesTipoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL docentes_tipo_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function actividadesTipoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL actividades_tipo_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoEstadoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL ayuda_economica_estado_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function convocatoriaEstadoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL convocatoria_estado_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function investigacionesAnoDepartamento(preferencesObject){
    try{
        let ano = preferencesObject.ano;
        console.log(ano);
        let anoActual =(new Date()).getFullYear();
        console.log(anoActual);
        let tipoQuery;
        if (ano === anoActual){
            tipoQuery =1;
        } else {
            tipoQuery=2;
        }
        return await sequelize.query(`CALL investigaciones_ano_departamento(${unidad},${ano},${tipoQuery})`);
    }catch (e) {
        return "error";
    }
}

async function investigacionesAnoSeccion(preferencesObject){
    try{
        let ano = preferencesObject.ano;
        console.log(ano);
        let anoActual =(new Date()).getFullYear();
        console.log(anoActual);
        let tipoQuery;
        if (ano === anoActual){
            tipoQuery =1;
        } else {
            tipoQuery=2;
        }
        return await sequelize.query(`CALL investigaciones_ano_seccion(${preferencesObject.idSeccion},${ano},${tipoQuery})`);
    }catch (e) {
        return "error";
    }
}

module.exports = {
    docentesTipoDepartamento:docentesTipoDepartamento,
    actividadesTipoDepartamento:actividadesTipoDepartamento,
    apoyoEconomicoEstadoDepartamento:apoyoEconomicoEstadoDepartamento,
    convocatoriaEstadoDepartamento:convocatoriaEstadoDepartamento,
    docentesTipoSeccion:docentesTipoSeccion,
    actividadesTipoSeccion:actividadesTipoSeccion,
    apoyoEconomicoEstadoSeccion:apoyoEconomicoEstadoSeccion,
    convocatoriaEstadoSeccion:convocatoriaEstadoSeccion,
    investigacionesAnoDepartamento:investigacionesAnoDepartamento,
    investigacionesAnoSeccion:investigacionesAnoSeccion
};