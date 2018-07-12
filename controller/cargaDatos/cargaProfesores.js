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
        await Promise.all( dataArray.map(async item => {
            try{
                let nombre = item[0];
                let apellidoP = item[1];
                let apellidoM = item[2];
                let dni = item[3];
                let telefono = item[4];
                let email = item[5];
                let seccion = item[6];
                let tipo = item[7];
                let codigo = item[8];
                let password = bcrypt.hashSync(item[9], 8);
                if (nombre === undefined || apellidoP === undefined || apellidoM === undefined|| dni === undefined
                    || telefono === undefined|| seccion === undefined|| tipo === undefined|| email === undefined
                    || codigo === undefined || password){
                    return message = "cargaDocente Failed undefined or empty columns";
                }else{
                    let esRepetido = await sequelize.query(`CALL verifica_docente_repetido (${codigo})`);

                    if (esRepetido[0] === undefined) {
                        await sequelize.query(`CALL insert_docente ('${nombre}', '${apellidoP}', '${apellidoM}',
                        ${dni}, ${telefono}, '${email}', '${seccion}', '${tipo}',${codigo},'${password}')`);
                    }
                    return message = "cargaDocente success on execution";
                }
            }catch (e) {
                winston.error("cargaDocente Failed: ",e);
                message = "cargaDocente Failed";
                return message;
            }
        }));
        winston.info("cargaDocente success on execution");
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