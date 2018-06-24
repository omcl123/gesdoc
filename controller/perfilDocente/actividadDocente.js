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

async function devuelveListaActividad(preferencesObject){

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

        if (idCiclo[0].id === undefined || idTipo[0].id === undefined || idEstado[0].id === undefined){
            winston.info("registraActividad success on execution");
            return -1;
        }

        await sequelize.query(`CALL insertActividad ('${idProfesor}','${idCiclo[0].id}','${idTipo[0].id}','${titulo}','${fecha_inicio}','${fecha_fin}', '${idEstado[0].id}', '${lugar}')`);



        let last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "actividad",
                }
            }
        );
        console.log("Actividad registrada correctamente");

        winston.info("registraActividad success on execution");

        return last_id[0].nuevo_id;

    } catch(e) {
        winston.error("registraActividad Failed: ",e);
        return -1;
    }
}



async function actualizaActividad(dataArray) {
    let message = "";

    try {

        let id_actividad = dataArray.id_actividad;
        let tipo = dataArray.tipo;
        let titulo = dataArray.titulo;
        let fecha_inicio = dataArray.fecha_inicio;
        let fecha_fin = dataArray.fecha_fin;
        let estado = dataArray.estado;
        let lugar = dataArray.lugar;
        let arrayArchivos = dataArray.archivos;

        Promise.all(arrayArchivos.map(async item =>{
            await sequelize.query(`CALL inserta_archivo_actividad(${id_actividad},${item.idArchivo})`);
        }));

        let idTipo = await sequelize.query(`CALL devuelveIdTipoActividad('${tipo}')`);
        let idEstado = await sequelize.query(`CALL devuelveIdEstadoActividad('${estado}')`);

        if (idTipo[0].id === undefined || idEstado[0].id === undefined){
            winston.info("actualizaActividad success on execution");
            return "actualizaActividad success on execution";
        }

        await sequelize.query(`CALL update_actividad ('${id_actividad}','${fecha_inicio}','${fecha_fin}','${titulo}','${idEstado[0].id}', '${idTipo[0].id}', '${lugar}')`);

        return message = "actualizaActividad success on execution";

    } catch(e) {
        winston.error("actualizaActividad Failed: ",e);
        message = "actualizaActividad Failed";
        return message;
    }
}


async function eliminaActividad(dataArray) {
    let message = "";

    try {

        let id_actividad = dataArray.id_actividad;


        await sequelize.query(`CALL delete_actividad ('${id_actividad}')`);

        return message = "eliminaActividad success on execution";


    } catch(e) {
        winston.error("eliminaActividad Failed: ",e);
        message = "eliminaActividad Failed";
        return message;
    }
}

async function devuelveActividad(preferencesObject){
    let message= "";
    try{
        let actividad = await sequelize.query('call devuelveActividad(:id_actividad)',
            {
               replacements:{
                   id_actividad:preferencesObject.id_actividad
               }
            });
        winston.info('devuelveActividad success');
        return actividad;
    }catch(e){
        winston.error("devuelveActividad Failed: ",e);
        message = "devuelveActividad Failed";
        return message;
    }
}

async function devuelveArchivos(preferencesObject){
    let actividadId = preferencesObject.id;
    let response = await sequelize.query(`call devuelve_archivos_actividad(${actividadId})`);
    return response;
}

module.exports ={
    registraActividad:registraActividad,
    devuelveListaActividad:devuelveListaActividad,
    actualizaActividad:actualizaActividad,
    eliminaActividad:eliminaActividad,
    devuelveActividad:devuelveActividad,
    devuelveArchivos:devuelveArchivos
};
