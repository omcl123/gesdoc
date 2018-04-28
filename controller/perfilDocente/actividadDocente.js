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

function listaInvestigacion(preferenceObject){


}

async function devuelveListaActividad(preferencesObject){
    let arregloInv = [];
    try{
        let actividades = await sequelize.query('CALL devuelveActividades(:id_profesor,:nombre_ciclo)',
            {
                replacements: {
                    id_profesor: parseInt(preferencesObject.codigo),
                    nombre_ciclo: preferencesObject.ciclo,

                }
            }
        );
        console.log(actividades);
        let jsonActividades = await Promise.all(actividades.map(async item => {
            let innerPart={};
            innerPart.id=item.id;
            innerPart.titulo=item.titulo;
            innerPart.tipo=item.tipo;
            innerPart.fecha_inicio=item.fecha_inicio;
            innerPart.fecha_fin=item.fecha_fin;
            innerPart.estado=item.estado;
            return innerPart;
        }));
        console.log(jsonActividades);
        winston.info("devuelveListaActividad succesful");
        return jsonActividades;
        //return arregloInv;
    }catch(e){
        console.log(e);
        winston.error("devuelveListaActividad failed");
    }
}
module.exports ={
    devuelveListaActividad:devuelveListaActividad
}