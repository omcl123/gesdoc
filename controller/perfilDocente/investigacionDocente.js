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

function listaInvestigacion(preferenceObject){


}

async function devuelveListaInvestigacion(preferencesObject){
    let arregloInv = [];
    try{
        let investigaciones = await sequelize.query('CALL devuelveInvestigaciones(:id_profesor,:nombre_ciclo)',
            {
                replacements: {
                    id_profesor: parseInt(preferencesObject.codigo),
                    nombre_ciclo: preferencesObject.ciclo,

                }
            }
        );

        let jsonInvestigaciones = Promise.all(investigaciones.map(async item => {
            let innerPart={};
            innerPart.titulo=item.titulo;
            innerPart.resumen=item.resumen;
            innerPart.estado=item.estado;
            innerPart.archivo=item.archivo;
            arregloInv.push(innerPart);
        }));

        winston.info("devuelveListaInvestigacion succesful");
        //return jsonInvestigaciones;
        return arregloInv;
    }catch(e){
        console.log(e);
        winston.error("devuelveListaInvestigacion failed");
    }
}
module.exports ={
    devuelveListaInvestigacion:devuelveListaInvestigacion
}