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

async function cargaDocente(dataArray) {
    let message = "";

    try {
        await dataArray.map(async item => {
            let nombre = item[0];
            let apellidoP = item[1];
            let apellidoM = item[2];
            let codigo = item[3];
            let dni = item[4];
            let email = item[5];
            let telefono = item[6];
            let seccion = item[7];
            let departamento = item[8];
            let fechaN = item[9];
            await sequelize.query(`CALL registraProfesor (:${nombre}, :${apellidoP}, :${apellidoM},
             ${codigo}, ${dni}, ${email}, ${telefono}, ${seccion}, ${departamento}, ${fechaN}`);
        });

        winston.info("cargaDocente success on execution");
        message = "cargaDocente success on execution";
        return message;
    } catch(e) {
        winston.error("cargaDocente Failed: ",e);
        message = "cargaDocente Failed";
        return message;
    }
}

module.exports = {
    cargaDocente: cargaDocente
};