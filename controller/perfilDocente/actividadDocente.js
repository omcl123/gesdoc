var winston = require('../../config/winston');
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

function querydB(query){
    /*let query = `SELECT p.idProfesor AS 'Codigo Profesor',p.Nombre AS 'Nombre Profesor',a.Descripcion AS 'Actividad'
                FROM profesor AS p
                INNER JOIN actividad AS a
                ON p.idProfesor = a.idProfesor;`;*/

    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}


async function devuelveActividad(){
    let jsonblock = {};
    try{
        let query = 'Call devuelveActividad()';
        let jsonBlock = await querydB(query);
        winston.info("devuelveActividad succesful");
        return jsonBlock;

    }catch(e){
        console.log(e);
        winston.error("devuelveActividad failed");
    }
}

module.exports ={
    devuelveActividad:devuelveActividad
}