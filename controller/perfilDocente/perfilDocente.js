var winston = require('../../config/winston');
const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect()

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

function querydB(query){ //query inside the code


    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}


async function devuelveDocente(preferencesObject){
    try{
        // let query = 'Call devuelveDocente()';
        //
        //
        // let jsonBlock =await querydB(query); //calling sp from the db

        let result = await sequelize.query('CALL devuelveDocente(:id_profesor,:nombre_ciclo)',
            {
                replacements: {
                    id_profesor: parseInt(preferencesObject.codigo),
                    nombre_ciclo: preferencesObject.ciclo,

                }
            }
        );
        jsonbloc = {};
        jsonbloc.codigo = result[0].codigo;
        jsonbloc.nombres = result[0].nombres;
        jsonbloc.apellidoP = result[0].apellidoP;
        jsonbloc.apellidoM = result[0].apellidoM;
        jsonbloc.tipo = result[0].tipo;
        jsonbloc.telefono = result[0].telefono;
        jsonbloc.correo = result[0].correo;
        jsonbloc.seccion = result[0].seccion;
        jsonbloc.departamento = result[0].departamento;
        jsonbloc.ciclo=preferencesObject.ciclo;
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
}