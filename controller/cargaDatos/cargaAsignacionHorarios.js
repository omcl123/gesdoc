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

async function cargaAsignacionHorarios(dataArray) {
    let message = "";

    try {
        await Promise.all(dataArray.map(async item => {
            try{
                let command = item[0];
                if (command === 0){
                    let curso = item[1];
                    let ciclo = item[2];
                    let numHorarios = item[3];

                    if (curso === undefined || ciclo === undefined || numHorarios === undefined){
                        return message = "cargaAsignacionHorarios Failed undefined or empty columns";
                    }else{
                        let esRepetido = await sequelize.query(`CALL verifica_asignacion_repetida ('${curso}','${ciclo}')`);

                        if (esRepetido[0] === undefined) {
                            await sequelize.query(`CALL insert_asignacion_horario ( '${curso}','${ciclo}', ${numHorarios})`);
                        }
                        return message = "cargaAsignacionHorarios success on execution";
                    }

                }else if (command === 1){
                    let curso = item[1];
                    let ciclo = item[2];

                    if (curso === undefined || ciclo === undefined || numHorario === undefined){
                        return message = "cargaAsignacionHorarios Failed undefined or empty columns";
                    }else{
                        let horEli = await sequelize.query(`CALL verifica_numero_horarios ('${curso}','${ciclo}')`);

                        if (horEli[0] > 0) {
                            await sequelize.query(`CALL elimina_asignacion_horario ( '${curso}','${ciclo}',${horEli})`);
                        }

                        return message = "cargaAsignacionHorarios success on execution";
                    }
                }
            }catch (e) {
                winston.error("cargaAsignacionHorarios Failed: ",e);
                message = "cargaAsignacionHorarios Failed";
                return message;
            }
        }));
        winston.info("cargaCurso success on execution");
        return message;
    } catch(e) {
        winston.error("cargaCurso Failed: ",e);
        message = "cargaCurso Failed";
        return message;
    }
}

module.exports = {
    cargaAsignacionHorarios: cargaAsignacionHorarios
};