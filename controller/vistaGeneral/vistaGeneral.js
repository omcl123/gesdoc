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

async function investigacionesAnoDepartamento(preferencesObject,unidad){
    try{
        return await sequelize.query(`CALL investigaciones_ano_departamento(${unidad},'${preferencesObject.anho}')`);
    }catch (e) {
        return "error";
    }
}

async function investigacionesAnoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL investigaciones_ano_seccion(${preferencesObject.idSeccion},'${preferencesObject.anho}')`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoAnoDepartamento(preferencesObject,unidad){
    try{
        return await sequelize.query(`CALL apoyo_ano_departamento(${unidad},'${preferencesObject.anho}')`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoAnoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL apoyo_ano_seccion(${preferencesObject.idSeccion},'${preferencesObject.anho}')`);
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
    investigacionesAnoSeccion:investigacionesAnoSeccion,
    apoyoEconomicoAnoDepartamento:apoyoEconomicoAnoDepartamento,
    apoyoEconomicoAnoSeccion:apoyoEconomicoAnoSeccion
};