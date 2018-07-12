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

async function cargaDepartamentos(dataArray) {

    try {
        await Promise.all( dataArray.map(async item => {
            try{
                let tipo = item[0];
                if(tipo === 1){
                    let nombre = item[1];
                    if (nombre === undefined ){
                        return message = "cargaDepartamentos Failed undefined or empty columns";
                    }else {

                        let esRepetido = await sequelize.query(`CALL verifica_departamento ('${nombre}'`);

                        if (esRepetido[0] === undefined) {
                            await sequelize.query(`CALL insert_departamento ('${nombre}')`);
                        }
                    }
                }
                else{
                    let idDep = item[2];
                    let nombre = item[3];
                    if (nombre === undefined || idDep === undefined){
                        return message = "cargaDepartamentos Failed undefined or empty columns";
                    }else {

                        let esRepetido = await sequelize.query(`CALL verifica_seccion ('${nombre}'`);

                        if (esRepetido[0] === undefined) {
                            await sequelize.query(`CALL insert_seccion('${idDep}','${nombre}')`);
                        }
                    }
                }

                return message = "cargaDepartamentos  success on execution";

            }catch (e) {
                message = "cargaDepartamentos Failed";
                return message;
            }
        }));
        let result = {};
        return result;
    } catch(e) {
        return e;
    }
}

module.exports = {
    cargaDepartamentos: cargaDepartamentos
};

