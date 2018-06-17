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

async function registraFoto(data){
    try{
        let response = await sequelize.query(`call insertaArchivo('${data.originalname}','${data.path}','${data.mimetype}');`);
        console.log(response[0]);
        return response[0];
    }catch (e) {
        return "error";
    }
}

async function modificaFoto(data,id){
    try{
        let pathAntiguo = await sequelize.query(`call encuentra_archivo(${id});`);
        let pathRemove = pathAntiguo[0].path;
        fs.unlink(pathRemove, (err) => {
            if (err) throw err;
            console.log('file was deleted');
        });
        let response = await sequelize.query(`call modificaArchivo(${id},'${data.originalname}','${data.path}','${data.mimetype}');`);
        console.log(response[0]);
        return response[0];
    }catch (e) {
        return "error";
    }
}

module.exports ={
    devuelveDocente:devuelveDocente,
    registraFoto:registraFoto,
    modificaFoto:modificaFoto
};