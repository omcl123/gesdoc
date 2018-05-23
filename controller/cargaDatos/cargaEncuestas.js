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

async function cargaEncuestas(dataArray) {

    try {
        await Promise.all(dataArray.map(async item => {
            try{
                let id_horario_profesor = item[0];
                let puntaje = item[1];
                let comentario = item[2];

                if (id_horario_profesor === undefined || puntaje === undefined || comentario === undefined){
                    return message = "cargaCurso Failed undefined or empty columns";
                }else{


                        await sequelize.query(`CALL insert_encuesta ('${id_horario_profesor}', '${puntaje}', '${comentario}')`);

                    return message = "cargaEncuesta  success on execution";
                }
            }catch (e) {
                winston.error("cargaEncuesta Failed: ",e);
                message = "cargaEncuesta Failed";
                return message;
            }
        }));

        let result = {};
        winston.info("cargaEncuestas success on execution");
        return result;
    } catch(e) {
        winston.error("cargaEncuestas Failed: ",e);
    }
}

module.exports = {
    cargaEncuestas: cargaEncuestas
};