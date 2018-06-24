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

async function devuelveDocente(preferencesObject){
    try{
        // let query = 'Call devuelveDocente()';
        //
        //
        // let jsonBlock =await querydB(query); //calling sp from the db

        let result = await sequelize.query('CALL devuelveDocente(:id_profesor)',
            {
                replacements: {
                    id_profesor: parseInt(preferencesObject.codigo),

                }
            }
        );
        jsonbloc = {};
        jsonbloc = result[0];

        winston.info("devuelveDocente succesful");
        console.log (result);
        return jsonbloc;

    }catch(e){
        console.log(e);
        winston.error("devuelveDocente failed");
    }
}


module.exports ={
    devuelveDocente:devuelveDocente
};