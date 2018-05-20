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
        await sequelize.query();
        return "success";
    }catch (e){
        return "error";
    }
}

async function listaDocenteAsignar(preferencesObject) {
    try {
        let jsonBlock = {};
        jsonBlock.preferencia = await sequelize.query();
        jsonBlock.general = await sequelize.query();
        return jsonBlock;
    } catch (e){
        return "error";
    }
}

module.exports ={
    listaDocenteAsignar:listaDocenteAsignar,
    asignaDocenteHorario:asignaDocenteHorario
};