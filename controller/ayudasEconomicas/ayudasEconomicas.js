var winston = require('../../config/winston');
const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect()

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



async function listarMotivos(preferencesObject){
    try {



        jsonMotivos = await  sequelize.query('CALL listarMotivosAyudasEconomicas()');
        console.log(jsonMotivos);

        return jsonMotivos;

    }catch(e){
        console.log(e);
        winston.error("registrarDocumentoGasto failed");
        return "error";
    }

}

async function estadoAyudaEconomica(preferencesObject,res){
    try{
        let response = await sequelize.query(`call estado_ayuda_economica(${preferencesObject.id})`);
        res.status(200).send({id:response[0].id,descripcion:response[0].descripcion});
    }catch (e) {
        return res.status(500).send({error:"error"});
    }
}

module.exports  ={
    listarMotivos:listarMotivos,
    estadoAyudaEconomica:estadoAyudaEconomica
};