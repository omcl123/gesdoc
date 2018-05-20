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

async function listaDocenteCargaAsignada(preferencesObject) {
    try{
        let jsonblock = {};
        let cargaArray = await sequelize.query();
        cargaArray.map(item =>{
            try{
                let cargaPart = {};
                return cargaPart;
            } catch (e){
                return "error";
            }
        });
        jsonblock.docentes = cargaArray;
        return jsonblock;
    } catch (e){
        return "error";
    }
}

async function detalleCargaDocenteAsignado() {
    try {
        let jsonBlock = {};
        jsonBlock.cursos = await sequelize.query();
        return jsonBlock;
    } catch (e){
        return "error";
    }
}

module.exports ={
    listaDocenteCargaAsignada:listaDocenteCargaAsignada,
    detalleCargaDocenteAsignado:detalleCargaDocenteAsignado
};