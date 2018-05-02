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

async function cargaHorarios(preferencesObject) {

    try {
        await dataArray.map(async item => {
            try{
                let codigoProf = item[0];
                let codigoCurso = item[1];
                let ciclo = item[2];
                let codigoHorario = item[3];

                if (codigoProf === undefined || codigoCurso === undefined || ciclo === undefined
                    || codigoHorario === undefined ){
                    return message = "cargaHorarios Failed undefined or empty columns";
                }else{
                    await sequelize.query(`CALL insert_horario (${codigoProf}, '${codigoCurso}', '${ciclo}',
                    '${codigoHorario}')`);

                    return message = "cargaHorarios  success on execution";
                }
            }catch (e) {
                winston.error("cargaHorarios Failed: ",e);
                message = "cargaHorarios Failed";
                return message;
            }
        });
        let result = {};
        winston.info("cargaHorarios success on execution");
        return result;
    } catch(e) {
        winston.error("cargaHorarios Failed: ",e);
    }
}

module.exports = {
    cargaHorarios: cargaHorarios
};