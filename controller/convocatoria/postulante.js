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
function convertirFecha(date){
    //20180429

    let year = Math.trunc(date / 10000);
    let month = Math.trunc((date - (10000 * year)) / 100);
    let day = date - (10000 * year) - (100 * month);
    let d = new Date(year + "-" + month + "-" + day);

    return (d);
}

async function listarPostulante(preferencesObject){
    let arregloInv = [];
    try{
        let postulantes = await sequelize.query('CALL devuelvePostulantes(:id_convocatoria)',
            {
                replacements: {
                    id_convocatoria: parseInt(preferencesObject.id),


                }
            }
        );
        console.log(postulantes);
        //p.nombres, p.apellido_paterno,p.apellido_materno,p.correo,p.fecha_nacimiento,p.numero_documento,
        // t.descripcion as 'tipo_documento',x.descripcion as 'sexo',s.nombre as 'pais_nacimiento',
        // p.lugar_nacimiento,p.direccion_domicilio,i.nombre as 'pais_domicilio',p.telefono,p.celular,d.descripcion as 'estado_postulante'
        let jsonPostulantes = await Promise.all(postulantes.map(async item => {
            let innerPart={};
            innerPart.id=item.id;
            innerPart.nombres=item.nombres;
            innerPart.apellido_paterno=item.apellido_paterno;
            innerPart.apellido_materno=item.apellido_materno;
            innerPart.correo=item.correo;
            innerPart.fecha_nacimiento=item.fecha_nacimiento;
            innerPart.numero_documento=item.numero_documento;
            innerPart.tipo_documento=item.tipo_documento;
            innerPart.sexo=item.sexo;
            innerPart.pais_nacimiento=item.pais_nacimiento;
            innerPart.lugar_nacimiento=item.lugar_nacimiento;
            innerPart.direccion_domicilio=item.direccion_domicilio;
            innerPart.pais_domicilio=item.pais_domicilio;
            innerPart.telefono=item.telefono;
            innerPart.celular=item.celular;
            innerPart.estado_postulante=item.estado_postulante;

            return innerPart;
        }));
        console.log(jsonPostulantes);
        winston.info("listarPostulante succesful");
        return jsonPostulantes;
        //return arregloInv;
    }catch(e){
        console.log(e);
        winston.error("listarPostulante failed");
    }
}

async function insertaPostulante(preferencesObject){
    try{


        await sequelize.query('CALL registraPostulante(:nombres,:apellido_paterno,:apellido_materno,:correo,:fecha_nacimiento,' +
            ':numero_documento,:tipo_documento,:sexo,:pais_nacimiento,:lugar_nacimiento,:pais_domicilio,:direccion_domicilio,:telefono,:celular,:id_convocatoria)',
            {
                replacements: {
                    nombres: preferencesObject.postulante.nombres,
                    apellido_paterno: preferencesObject.postulante.apellido_paterno,
                    apellido_materno: preferencesObject.postulante.apellido_materno,
                    correo: preferencesObject.postulante.correo,
                    fecha_nacimiento: preferencesObject.postulante.fecha_nacimiento,
                    numero_documento: preferencesObject.postulante.numero_documento,
                    tipo_documento:preferencesObject.postulante.tipo_documento,
                    sexo: preferencesObject.postulante.sexo,
                    pais_nacimiento: preferencesObject.postulante.pais_nacimiento,
                    lugar_nacimiento: preferencesObject.postulante.lugar_nacimiento,
                    pais_domicilio:preferencesObject.postulante.pais_domicilio,
                    direccion_domicilio: preferencesObject.postulante.direccion_domicilio,
                    telefono: preferencesObject.postulante.telefono,
                    celular: preferencesObject.postulante.celular,
                    id_convocatoria:parseInt(preferencesObject.id_convocatoria)


                }
            }
        );
        return "postulante registrado correctamente"
    }catch(e){
        console.log(e);
        winston.error("insertaPostulante failed");
        return -1;
    }


}

async function registrarPostulanteInvestigacion(preferencesObject,last_id){
    let longitud = preferencesObject.postulante_investigacion.length;
    let i ;
    for (i=0; i<longitud;i++) {
        let fecha = convertirFecha(preferencesObject.postulante_investigacion[i].fecha);
        await sequelize.query('CALL registraPostulanteInvestigacion(:id_postulante,:titulo,:resumen,:fecha_in,:archivo)',
            {

                replacements: {
                    id_postulante: parseInt(last_id),
                    titulo:preferencesObject.postulante_investigacion[i].titulo,
                    resumen:preferencesObject.postulante_investigacion[i].resumen,
                    archivo:preferencesObject.postulante_investigacion[i].archivo_investigacion,
                    fecha_in:fecha
                }
            }
        );
    }

}
async function registrarPostulanteExperiencia(preferencesObject,last_id){
    let longitud = preferencesObject.postulante_experiencia.length;
    let i ;
    for (i=0; i<longitud;i++) {
        let fecha_i= convertirFecha(preferencesObject.postulante_experiencia[i].fecha_inicio);
        let fecha_f= convertirFecha(preferencesObject.postulante_experiencia[i].fecha_fin);
        await sequelize.query('CALL registraPostulanteExperiencia(:id_postulante,:descripcion,:fecha_ini,:fecha_fin,:archivo,:institucion)',
            {

                replacements: {
                    id_postulante: last_id,
                    descripcion:preferencesObject.postulante_experiencia[i].descripcion,
                    fecha_ini:fecha_i,
                    fecha_fin:fecha_f,
                    archivo:preferencesObject.postulante_experiencia[i].archivo_experiencia
                }
            }
        );
    }

}

async function registrarPostulanteDocenciaCargo(preferencesObject,last_id){
    let longitud = preferencesObject.postulante_docencia_cargo.length;
    let i ;
    for (i=0; i<longitud;i++) {
        let fecha_i= convertirFecha(preferencesObject.postulante_docencia_cargo[i].fecha_inicio);
        let fecha_f= convertirFecha(preferencesObject.postulante_docencia_cargo[i].fecha_fin);
        await sequelize.query('CALL registraPostulanteDocenciaCargo(:id_postulante,:nombre,:fecha_ini,:fecha_fin,:institucion,:archivo)',
            {

                replacements: {
                    id_postulante: last_id,
                    nombre:preferencesObject.postulante_docencia_cargo[i].nombre,
                    fecha_ini:fecha_i,
                    fecha_fin:fecha_f,
                    institucion:preferencesObject.postulante_docencia_cargo[i].institucion,
                    archivo:preferencesObject.postulante_docencia_cargo[i].archivo_cargo
                }
            }
        );
    }
}
async function registrarPostulanteDocenciaAsesoria(preferencesObject,last_id){
    let longitud = preferencesObject.postulante_docencia_asesoria.length;
    let i ;
    for (i=0; i<longitud;i++) {
        let fecha = convertirFecha(preferencesObject.requiere_docencia_asesoria[i].fecha_publicacion);

        await sequelize.query('CALL registraPostulanteDocenciaAsesoria(:id_postulante,:titulo,:resumen,:fecha)',
            {

                replacements: {
                    id_postulante: last_id,
                    nombre: preferencesObject.postulante_docencia_asesoria[i].titulo,
                    fecha: fecha,
                    institucion: preferencesObject.postulante_docencia_asesoria[i].resumen

                }
            }
        );
    }
}
async function registrarPostulanteDocenciaPremio(preferencesObject,last_id){
    let longitud = preferencesObject.postulante_docencia_premio.length;
    let i ;
    for (i=0; i<longitud;i++) {

        await sequelize.query('CALL registraPostulanteDocenciaPremio(:id_postulante,:archivo,:url,:descripcion)',
            {

                replacements: {
                    id_postulante: last_id,
                    archivo: preferencesObject.postulante_docencia_premio[i].archivo_premio,
                    url: preferencesObject.postulante_docencia_premio[i].url_premio,
                    descripcion: preferencesObject.postulante_docencia_premio[i].descripcion

                }
            }
        );
    }
}
async function registrarPremioGrado(preferencesObject,last_id,i){
    let last_id2= await sequelize.query(' CALL devuelveSiguienteId(:tabla )',
        {

            replacements: {
                tabla: "postulante_grado_academico",
            }
        }
    );
    let longitud2= preferencesObject.postulante_grado_academico[i].premio;
    let j;
    for (j=0; j<longitud2;j++) {

        await sequelize.query('CALL registraPostulanteDocenciaGrado(:id_postulante_grado,:archivo_premio,:url,:descripcion_url,:descripcion_archivo_premio)',
            {

                replacements: {
                    id_postulante_grado: last_id2,
                    archivo_premio: preferencesObject.postulante_grado_academico[i].premio[j].archivo_premio,
                    url: preferencesObject.postulante_grado_academico[i].premio[j].url,
                    descripcion_url: preferencesObject.postulante_grado_academico[i].premio[j].descripcion_url,
                    descripcion_archivo_premio: preferencesObject.postulante_grado_academico[i].premio[j].descripcion_archivo_premio

                }
            }
        );
    }

}
async function registrarPostulanteGrado(preferencesObject,last_id){
    let longitud = preferencesObject.postulante_grado_academico.length;
    let i ;
    for (i=0; i<longitud;i++) {
        let fecha_obtencion1= convertirFecha(preferencesObject.postulante_grado_academico[i].fecha_obtencion);
        await sequelize.query('CALL registraPostulanteDocenciaGrado(:id_postulante,:especialidad,:pais,:institucion,:nombre_titulo,:egresado,:fecha_obtencion,:titulo_tesis,:url_tesis,:grado_academico)',
            {

                replacements: {
                    id_postulante: preferencesObject.postulante.id,
                    especialidad: preferencesObject.postulante_grado_academico[i].especialidad,
                    pais: preferencesObject.postulante_grado_academico[i].pais,
                    institucion: preferencesObject.postulante_grado_academico[i].institucion,
                    nombre_titulo: preferencesObject.postulante_grado_academico[i].nombre_titulo,
                    egresado: preferencesObject.postulante_grado_academico[i].egresado,
                    fecha_obtencion:fecha_obtencion1,
                    titulo_tesis: preferencesObject.postulante_grado_academico[i].titulo_tesis,
                    url_tesis: preferencesObject.postulante_grado_academico[i].url_tesis,
                    grado_academico: preferencesObject.postulante_grado_academico[i].grado_academico


                }
            }
        );
        if (preferencesObject.postulante_grado_academico[i].premio!= null){
            await registrarPremioGrado(preferencesObject,last_id,i)


        }
    }
}
async function requerimientos(preferencesObject,last_id){

    let requerimientos = await sequelize.query('CALL devuelveRequerimientosConvocatoria(:id_convocatoria)',
        {
            replacements: {
                id_convocatoria: parseInt(preferencesObject.id_convocatoria),


            }
        }
    );
    console.log(requerimientos[0].requiere_investigacion);
    //para registrar las tablas
    if (requerimientos[0].requiere_investigacion){
        if(preferencesObject.postulante_investigacion!=null)  {
            await registrarPostulanteInvestigacion(preferencesObject,last_id);
        }
        else  return -1;

    }
    // if (requerimientos[0].requiere_experiencia){
    //     if(preferencesObject.postulante_experiencia!=null)  {
    //         await registrarPostulanteExperiencia(preferencesObject,last_id);
    //     }
    //     else  return -1;
    // }
    // if (requerimientos[0].requiere_docencia_cargo){
    //     if(preferencesObject.postulante_docencia_cargo!=null)  {
    //         await registrarPostulanteDocenciaCargo(preferencesObject,last_id);
    //     }
    //     else  return -1;
    // }
    // if (requerimientos[0].requiere_docencia_asesoria){
    //     if(preferencesObject.postulante_docencia_asesoria!=null)  {
    //         await registrarPostulanteDocenciaAsesoria(preferencesObject,last_id);
    //     }
    //     else  return -1;
    // }
    // if (requerimientos[0].requiere_docencia_premio){
    //     if(preferencesObject.postulante_docencia_premio!=null)  {
    //         await registrarPostulanteDocenciaPremio(preferencesObject,last_id);
    //     }
    //     else  return -1;
    // }
    // if (requerimientos[0].requiere_grado_titulo || requerimientos[0].requiere_grado_maestria || requerimientos[0].requiere_grado_doctorado
    //     || requerimientos[0].requiere_grado_diplomatura ){
    //     if(preferencesObject.postulante_grado_academico!=null)  {
    //         await registrarPostulanteGrado(preferencesObject,last_id);
    //     }
    //     else  return -1;
    // }

    return "Registro requerimientos correcto"
}
async function registrarPostulante(preferencesObject){
    try{
        mensaje = "";
        console.log(JSON.stringify(preferencesObject.postulante.apellido_paterno));
        //await insertaPostulante(preferencesObject);
        let last_id= await sequelize.query(' CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "postulante",
                }
            }
        );
        console.log(last_id);



        winston.info("registrarPostulante succesful");
        //return "correcto";
        return await requerimientos(preferencesObject,last_id[0].nuevo_id);
    }catch(e){
        console.log(e);
        winston.error("listarPostulante failed");
    }
}
module.exports  ={
    listarPostulante:listarPostulante,
    registrarPostulante:registrarPostulante
}