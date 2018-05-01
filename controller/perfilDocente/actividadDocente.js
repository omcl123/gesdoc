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



async function registraActividad(dataArray) {
    let message = "";

    try {

        let idProfesor = dataArray.idProfesor;
        let ciclo = dataArray.ciclo;
        let tipo = dataArray.tipo;
        let titulo = dataArray.titulo;
        let fecha_inicio = dataArray.fecha_inicio;
        let fecha_fin = dataArray.fecha_fin;
        let estado = dataArray.estado;
        let lugar = dataArray.lugar;


        let idCiclo = await sequelize.query(`CALL devuelveIdCiclo('${ciclo}')`);
        let idTipo = await sequelize.query(`CALL devuelveIdTipoActividad('${tipo}')`);
        let idEstado = await sequelize.query(`CALL devuelveIdEstadoActividad('${estado}')`);

        if (idCiclo[0].id == undefined || idCiclo[0].id == undefined || idCiclo[0].id == undefined){
            winston.info("registraActividad success on execution");
            return message = "registraActividad success on execution";
        }

        await sequelize.query(`CALL insertActividad ('${idProfesor}','${idCiclo[0].id}','${idTipo[0].id}','${titulo}','${fecha_inicio}','${fecha_fin}', '${idEstado[0].id}', '${lugar}')`);

        return message = "registraActividad success on execution";


        winston.info("registraActividad success on execution");
        return message;

    } catch(e) {
        winston.error("registraActividad Failed: ",e);
        message = "registraActividad Failed";
        return message;
    }
}


module.exports ={
    registraActividad:registraActividad,
    devuelveListaActividad:devuelveListaActividad
}
