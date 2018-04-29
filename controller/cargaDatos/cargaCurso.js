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

async function cargaCurso(dataArray) {
    let message = "";

    try {
        await dataArray.map(async item => {
            try{
                let codigo = item[0];
                let nombre = item[1];
                let creditos = item[2];
                let horasDictado = item[3];
                let facultad = item[4];
                let seccion = item[5];
                let tipoCurso = item[6]
                if (nombre === undefined || codigo === undefined || creditos === undefined|| horasDictado === undefined
                    || facultad === undefined|| seccion === undefined|| tipoCurso === undefined){
                    return message = "cargaCurso Failed undefined or empty columns";
                }else{
                    let esRepetido = await sequelize.query(`CALL verifica_curso_repetido (${codigo})`);

                    if (esRepetido[0] === undefined) {
                        await sequelize.query(`CALL insert_curso ('${nombre}', '${codigo}', '${creditos}',
                        ${horasDictado}, ${facultad}, '${seccion}', '${tipoCurso}')`);
                    }
                    return message = "cargaCurso success on execution";
                }
            }catch (e) {
                winston.error("cargaCurso Failed: ",e);
                message = "cargaCurso Failed";
                return message;
            }
        });
        winston.info("cargaCurso success on execution");
        return message;
    } catch(e) {
        winston.error("cargaCurso Failed: ",e);
        message = "cargaCurso Failed";
        return message;
    }
}

module.exports = {
    cargaCurso: cargaCurso
};