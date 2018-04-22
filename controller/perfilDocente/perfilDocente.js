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

function querydB(){
    let query = `SELECT p.idProfesor AS 'Codigo Profesor',p.Nombre AS 'Nombre Profesor',d.Nombre AS 'Deparamento'
                FROM profesor AS p
                INNER JOIN departamento AS d
                ON p.idDepartamento = d.idDepartamento`;

    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}


async function devuelveDocente(){
    let jsonblock = {};
    try{
        let jsonBlock = await querydB();
        winston.info("devuelveDocente succesful");
        return jsonBlock;

    }catch(e){
        console.log(e);
        winston.error("devuelveDocente failed");
    }
}

module.exports ={
    devuelveDocente:devuelveDocente
}