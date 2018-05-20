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

const postulante_controller  = require('./postulante');

async function listaConvocatoria(preferencesObject){
    // codigo(id), clave_curso, nombre_convocatoria, fecha creacion, estado
    try {

        let convocatorias = await sequelize.query('CALL listaConvocatoria()');

        let jsonConvocatorias= await Promise.all(convocatorias.map(async item => {
            let innerPart={};
            innerPart.codigo=item.codigo;
            innerPart.clave_curso=item.clave_curso;
            innerPart.nombre_curso=item.nombre_curso;
            innerPart.fecha_creacion=item.fecha_creacion;
            innerPart.fecha_limite=item.fecha_limite;
            innerPart.estado_convocatoria=item.estado_convocatoria;


            return innerPart;
        }));
        console.log(jsonConvocatorias);
        winston.info("listaConvocatoria succesful");
        return jsonConvocatorias;


    }catch(e){
        console.log(e);
        winston.error("listaConvocatoria failed");
    }
}



async function detalleConvocatoria(preferencesObject){
    // nombre_convocatoria, cantidad de postulantes, cantidad de postulantes aceptados, lista de postulantes
    try {

        let convocatoria = await sequelize.query('CALL detalleConvocatoria(:in_convocatoria)',
            {
                replacements: {
                    in_convocatoria: preferencesObject.id

                }
            }
        );

        console.log (convocatoria);

        //listado de postulantes
        let list_postulantes = await postulante_controller.listarPostulante(preferencesObject);

        console.log ("Respuesta del import");
        console.log (list_postulantes);

        let jsondetalleConvocatoria= await Promise.all(convocatoria.map(async item => {
            let innerPart={};
            innerPart.codigo=item.codigo;
            innerPart.nombre=item.nombre;
            innerPart.fecha_limite=item.fecha_limite;
            innerPart.cantidad_postulantes=item.cantidad_postulantes;
            innerPart.cantidad_postulantes_aceptados=item.cantidad_postulantes_aceptados;

            innerPart.postulantes = await Promise.all(list_postulantes.map(async item2 => {
                let innerPart2={};
                innerPart2.codigo = item2.id;
                innerPart2.nombre = item2.nombres + ' ' +item2.apellido_paterno + ' ' + item2.apellido_materno;
                innerPart2.fecha_postulacion = item2.fecha_nacimiento;
                innerPart2.estado_postulacion = item2.estado_postulante;
                //innerPart2.estado_documentos = falta
                return innerPart2;
            }));

            return innerPart;
        }));


        return jsondetalleConvocatoria;

    }catch(e){
        console.log(e);
        winston.error("detalleConvocatoria failed");
    }
}


module.exports  ={
    detalleConvocatoria:detalleConvocatoria,
    listaConvocatoria:listaConvocatoria
}
