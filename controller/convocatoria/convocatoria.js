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




async function listaConvocatoria(preferencesObject){
    try {

        let jsonlistaConvocatoria = await sequelize.query('CALL listaConvocatoria()');

        winston.info("listaConvocatoria succesful");
        console.log (result);
        return jsonlistaConvocatoria;

    }catch(e){
        console.log(e);
        winston.error("listaConvocatoria failed");
    }
}



async function detalleConvocatoria(preferencesObject){
    try {

        let jsondetalleConvocatoria = await sequelize.query('CALL detalleConvocatoria(:codigo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo

                }
            }
        );

        winston.info("detalleConvocatoria succesful");
        console.log (result);
        return jsondetalleConvocatoria;

    }catch(e){
        console.log(e);
        winston.error("detalleConvocatoria failed");
    }
}


module.exports  ={
    detalleConvocatoria:detalleConvocatoria,
    listaConvocatoria:listaConvocatoria
}
