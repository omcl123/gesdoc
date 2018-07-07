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

async function cargaHorarios(dataArray) {

    try {
        await Promise.all( dataArray.map(async item => {
            try{
                let codigoProf = item[0];
                let participacion = item[1];
                let puntaje = item[2];
                let codigoCurso = item[3];
                let ciclo = item[4];
                let codigoHorario = item[5];

                if (codigoProf === undefined || codigoCurso === undefined || ciclo === undefined
                    || codigoHorario === undefined ){
                    return message = "cargaHorarios Failed undefined or empty columns";
                }else{

                    let esRepetido = await sequelize.query(`CALL verifica_curso_ciclo_repetido ('${codigoCurso}', '${ciclo}')`);

                    if (esRepetido[0] === undefined) {
                        await sequelize.query(`CALL insert_curso_ciclo ('${codigoCurso}', '${ciclo}')`);
                        winston.info("cargaHorarios insert new cursoxciclo success on execution");
                    }

                    //verifica horario duplicado
                    let horario_esRepetido = await sequelize.query(`CALL verifica_horario_duplicado ('${codigoCurso}', '${ciclo}','${codigoHorario}')`);


                    if (horario_esRepetido[0] === undefined) {
                        await sequelize.query(`CALL insert_horario (${codigoProf}, '${codigoCurso}', '${ciclo}',
                        '${codigoHorario}', ${participacion}, ${puntaje})`);

                        winston.info("Horarios insert new insert_horario success on execution");
                    }else{
                        await sequelize.query(`CALL insert_horario_profesor (${codigoProf}, '${codigoCurso}', '${ciclo}',
                        '${codigoHorario}', ${participacion}, ${puntaje})`);
                    }

                    return message = "cargaHorarios  success on execution";
                }
            }catch (e) {
                winston.error("cargaHorarios Failed: ",e);
                message = "cargaHorarios Failed";
                return message;
            }
        }));
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

