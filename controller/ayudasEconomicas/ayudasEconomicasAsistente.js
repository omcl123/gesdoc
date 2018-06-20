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


const s_boletos = "Boletos";
const s_inscripcion = "Inscripcion del Paper";
const s_viaticos = "Viaticos";
const s_costo_maestria = "Costo de la maestria/doctorado";




function convertirFecha(date){
    //20180429

    let year = Math.trunc(date / 10000);
    let month = Math.trunc((date - (10000 * year)) / 100);
    let day = date - (10000 * year) - (100 * month);
    let d = new Date(year + "-" + month + "-" + day);

    return (d);
}


async function tiene_elemento(data,elemento){
    let key;
    for(key in data) {
        if(data[key].descripcion === elemento)
            return 1;
    }
    return 0;
}

async function cantidad_elementos(data){
    let key, count = 0;
    for(key in data) {
        if(data.hasOwnProperty(key)) {
            count++;
        }
    }
    return count;
}

async function insertaAyudaEconomica(preferencesObject){
    try {
        let motivo;

        let codigo_profesor;
        let investigacion;

        let monto;
        let fecha_solicitud;
        let fecha_inicio;
        let fecha_fin;
        let pais;
        //let ciudad;
        //servicios
        let servicios;
        let servicio_boletos = 0;
        let servicio_viaticos = 0;
        let servicio_costo_maestria = 0;
        let servicio_inscripcion = 0;
        let comentario;
        let observaciones;


        let instituto_universidad;

        if (preferencesObject.fecha_solicitud!=null) {
            console.log("fecha_solicitud NO es nulo");
            fecha_solicitud = convertirFecha(preferencesObject.fecha_solicitud);
        }else{
            console.log("fecha_solicitud es nulo");
            winston.info("fecha_solicitud no puede ser nulo");
            fecha_solicitud=null;
            return -1;
        }

        if (preferencesObject.fecha_inicio!=null) {
            console.log("fecha_inicio NO es nulo");
            fecha_inicio = convertirFecha(preferencesObject.fecha_inicio);
        }else{
            console.log("fecha_inicio es nulo");
            winston.info("fecha_inicio no puede ser nulo");
            fecha_inicio=null;
            return -1;
        }
        if (preferencesObject.fecha_fin!=null) {
            console.log("fecha_fin NO es nulo");
            fecha_fin = convertirFecha(preferencesObject.fecha_fin);
        }else{
            console.log("fecha_fin es nulo");
            winston.info("fecha_fin no puede ser nulo");
            fecha_fin=null;
            return -1;
        }


        if (preferencesObject.motivo != null) {
            console.log("motivo NO es nulo");
            motivo = preferencesObject.motivo;
        } else {
            console.log("motivo es nulo");
            motivo = null;
        }


        if (preferencesObject.observaciones != null) {
            console.log("observaciones NO es nulo");
            observaciones = preferencesObject.observaciones;
        } else {
            console.log("observaciones es nulo");
            observaciones = null;
        }

        if (preferencesObject.codigo_profesor != null) {
            console.log("codigo_profesor NO es nulo");
            codigo_profesor = preferencesObject.codigo_profesor;
        } else {
            console.log("codigo_profesor es nulo");
            codigo_profesor = null;
        }



        if (preferencesObject.investigacion != null) {
            console.log("investigacion NO es nulo");
            investigacion = preferencesObject.investigacion;
        } else {
            console.log("investigacion es nulo");
            investigacion = null;
        }


        if (preferencesObject.monto != null) {
            console.log("monto NO es nulo");
            monto = preferencesObject.monto;
        } else {
            console.log("monto es nulo");
            monto = null;
        }


        if (preferencesObject.comentario != null) {
            console.log("comentario NO es nulo");
            comentario = preferencesObject.comentario;
        } else {
            console.log("comentario es nulo");
            comentario = null;
        }

        if (preferencesObject.pais != null) {
            console.log("pais NO es nulo");
            pais = preferencesObject.pais;
        } else {
            console.log("pais es nulo");
            pais = null;
        }

        if (preferencesObject.instituto_universidad != null) {
            console.log("instituto_universidad NO es nulo");
            instituto_universidad = preferencesObject.instituto_universidad;
        } else {
            console.log("instituto_universidad es nulo");
            instituto_universidad = null;
        }


        if (preferencesObject.servicios != null) {
            console.log("servicios NO es nulo");
            servicios = preferencesObject.servicios;
        } else {
            console.log("servicios es nulo");
            servicios = null;
        }

        if (servicios != null){

            servicio_boletos = await tiene_elemento(servicios,s_boletos);
            servicio_costo_maestria = await tiene_elemento(servicios,s_costo_maestria);
            servicio_inscripcion = await tiene_elemento(servicios,s_inscripcion);
            servicio_viaticos = await tiene_elemento(servicios,s_viaticos);


        }


        if (motivo!=null&&codigo_profesor!=null&&monto!=null&&fecha_solicitud!=null&&fecha_inicio!=null&&fecha_fin!=null&&investigacion!=null){

            //inserta profesor_investigacion


            let inv_profe = await sequelize.query("CALL verifica_InvProfesor_repetido(:codigo_profesor,:investigacion)",
                {

                    replacements: {
                        codigo_profesor:codigo_profesor,
                        investigacion:investigacion
                    }
                });

            console.log(inv_profe);

            let cant_inv_profe = await cantidad_elementos(inv_profe);
            console.log(cant_inv_profe);

            if (cant_inv_profe === 0){
                console.log("Se inserta inv_profe");
                await sequelize.query("CALL insertaInvProfesor(:codigo_profesor,:investigacion)",
                    {

                        replacements: {
                            codigo_profesor:codigo_profesor,
                            investigacion:investigacion
                        }
                    });
            }


            await sequelize.query('CALL insertaAyudaEconomica(:codigo_profesor,:investigacion,:monto,:fecha_solicitud,:fecha_inicio,:fecha_fin,:motivo,:comentario,:observaciones,:instituto_universidad,:pais,:servicio_boletos,:servicio_costo_maestria,:servicio_inscripcion,:servicio_viaticos)',
                {

                    replacements: {
                        codigo_profesor:codigo_profesor,
                        investigacion:investigacion,
                        monto:monto,
                        fecha_solicitud:fecha_solicitud,
                        fecha_inicio:fecha_inicio,
                        fecha_fin:fecha_fin,
                        motivo:motivo,
                        instituto_universidad:instituto_universidad,
                        comentario:comentario,
                        observaciones:observaciones,
                        pais:pais,
                        servicio_boletos:servicio_boletos,
                        servicio_costo_maestria:servicio_costo_maestria,
                        servicio_inscripcion:servicio_inscripcion,
                        servicio_viaticos:servicio_viaticos
                    }
                }
            );
        }

    }catch(e){
        console.log(e);
        winston.error("insertaAyudaEconomica failed");
        return -1;
    }
}

async function registrarAyudaEconomica(preferencesObject){
    try {
        await insertaAyudaEconomica(preferencesObject);


        last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "ayuda_economica",
                }
            }
        );
        console.log("AyudaEconomica registrada correctamente");

        return last_id;

    }catch(e){
        console.log(e);
        winston.error("registrarAyudaEconomica failed");
        return -1;
    }

}



async function insertaDocumentoGasto(preferencesObject){
    try {
        let id_ayuda_economica;
        let numero_documento;
        let detalle;
        let monto_justificacion;
        let observaciones;
        let tipo_documento;

        if (preferencesObject.id_ayuda_economica != null) {
            console.log("id_ayuda_economica NO es nulo");
            id_ayuda_economica = preferencesObject.id_ayuda_economica;
        } else {
            console.log("id_ayuda_economica es nulo");
            id_ayuda_economica = null;
        }

        if (preferencesObject.numero_documento != null) {
            console.log("numero_documento NO es nulo");
            numero_documento = preferencesObject.numero_documento;
        } else {
            console.log("numero_documento es nulo");
            numero_documento = null;
        }

        if (preferencesObject.monto_justificacion != null) {
            console.log("monto_justificacion NO es nulo");
            monto_justificacion = preferencesObject.monto_justificacion;
        } else {
            console.log("monto_justificacion es nulo");
            monto_justificacion = null;
        }

        if (preferencesObject.detalle != null) {
            console.log("detalle NO es nulo");
            detalle = preferencesObject.detalle;
        } else {
            console.log("detalle es nulo");
            detalle = null;
        }

        if (preferencesObject.tipo_documento != null) {
            console.log("tipo_documento NO es nulo");
            tipo_documento = preferencesObject.tipo_documento;
        } else {
            console.log("tipo_documento es nulo");
            tipo_documento = null;
        }

        if (preferencesObject.observaciones != null) {
            console.log("observaciones NO es nulo");
            observaciones = preferencesObject.observaciones;
        } else {
            console.log("observaciones es nulo");
            observaciones = null;
        }

        if (id_ayuda_economica!=null&&numero_documento!=null&&monto_justificacion!=null){
            await sequelize.query('CALL insertaJustificacion(:id_ayuda_economica,:numero_documento,:detalle,:monto_justificacion,:observaciones,:tipo_documento)',
                {

                    replacements: {
                        id_ayuda_economica:id_ayuda_economica,
                        numero_documento:numero_documento,
                        detalle:detalle,
                        monto_justificacion:monto_justificacion,
                        observaciones:observaciones,
                        tipo_documento:tipo_documento
                    }
                }
            );
        }

    }catch(e){
        console.log(e);
        winston.error("insertaDocumentoGasto failed");
        return -1;
    }
}


async function registrarDocumentoGasto(preferencesObject){
    try {

        await insertaDocumentoGasto(preferencesObject);


        last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "justificacion",
                }
            }
        );
        console.log("Documento registrado correctamente");

        return last_id;

    }catch(e){
        console.log(e);
        winston.error("registrarDocumentoGasto failed");
        return -1;
    }

}


async function modificarAyudaEconomica(preferencesObject){
    try {
        let id_ayuda_economica;
        let motivo;
        let monto;
        let fecha_solicitud;
        let fecha_inicio;
        let fecha_fin;
        let pais;
        let servicios;
        let servicio_boletos = 0;
        let servicio_viaticos = 0;
        let servicio_costo_maestria = 0;
        let servicio_inscripcion = 0;
        let comentario;
        let observaciones;


        let instituto_universidad;

        if (preferencesObject.id_ayuda_economica != null) {
            console.log("id_ayuda_economica NO es nulo");
            id_ayuda_economica = preferencesObject.id_ayuda_economica;
        } else {
            console.log("id_ayuda_economica es nulo");
            id_ayuda_economica = null;
        }

        if (preferencesObject.fecha_solicitud!=null) {
            console.log("fecha_solicitud NO es nulo");
            fecha_solicitud = convertirFecha(preferencesObject.fecha_solicitud);
        }else{
            console.log("fecha_solicitud es nulo");
            winston.info("fecha_solicitud no puede ser nulo");
            fecha_solicitud=null;
            return -1;
        }

        if (preferencesObject.fecha_inicio!=null) {
            console.log("fecha_inicio NO es nulo");
            fecha_inicio = convertirFecha(preferencesObject.fecha_inicio);
        }else{
            console.log("fecha_inicio es nulo");
            winston.info("fecha_inicio no puede ser nulo");
            fecha_inicio=null;
            return -1;
        }
        if (preferencesObject.fecha_fin!=null) {
            console.log("fecha_fin NO es nulo");
            fecha_fin = convertirFecha(preferencesObject.fecha_fin);
        }else{
            console.log("fecha_fin es nulo");
            winston.info("fecha_fin no puede ser nulo");
            fecha_fin=null;
            return -1;
        }


        if (preferencesObject.motivo != null) {
            console.log("motivo NO es nulo");
            motivo = preferencesObject.motivo;
        } else {
            console.log("motivo es nulo");
            motivo = null;
        }


        if (preferencesObject.observaciones != null) {
            console.log("observaciones NO es nulo");
            observaciones = preferencesObject.observaciones;
        } else {
            console.log("observaciones es nulo");
            observaciones = null;
        }



        if (preferencesObject.monto != null) {
            console.log("monto NO es nulo");
            monto = preferencesObject.monto;
        } else {
            console.log("monto es nulo");
            monto = null;
        }


        if (preferencesObject.comentario != null) {
            console.log("comentario NO es nulo");
            comentario = preferencesObject.comentario;
        } else {
            console.log("comentario es nulo");
            comentario = null;
        }

        if (preferencesObject.pais != null) {
            console.log("pais NO es nulo");
            pais = preferencesObject.pais;
        } else {
            console.log("pais es nulo");
            pais = null;
        }

        if (preferencesObject.instituto_universidad != null) {
            console.log("instituto_universidad NO es nulo");
            instituto_universidad = preferencesObject.instituto_universidad;
        } else {
            console.log("instituto_universidad es nulo");
            instituto_universidad = null;
        }


        if (preferencesObject.servicios != null) {
            console.log("servicios NO es nulo");
            servicios = preferencesObject.servicios;
        } else {
            console.log("servicios es nulo");
            servicios = null;
        }


        if (servicios != null){

            servicio_boletos = await tiene_elemento(servicios,s_boletos);
            servicio_costo_maestria = await tiene_elemento(servicios,s_costo_maestria);
            servicio_inscripcion = await tiene_elemento(servicios,s_inscripcion);
            servicio_viaticos = await tiene_elemento(servicios,s_viaticos);


        }

        if (id_ayuda_economica!=null&&motivo!=null&&monto!=null&&fecha_solicitud!=null&&fecha_inicio!=null&&fecha_fin!=null){
            await sequelize.query('CALL modificaAyudaEconomica(:id_ayuda_economica,:monto,:fecha_solicitud,:fecha_inicio,:fecha_fin,:motivo,:comentario,:observaciones,:instituto_universidad,:pais,:servicio_boletos,:servicio_costo_maestria,:servicio_inscripcion,:servicio_viaticos)',
                {

                    replacements: {
                        id_ayuda_economica:id_ayuda_economica,
                        monto:monto,
                        fecha_solicitud:fecha_solicitud,
                        fecha_inicio:fecha_inicio,
                        fecha_fin:fecha_fin,
                        motivo:motivo,
                        instituto_universidad:instituto_universidad,
                        comentario:comentario,
                        observaciones:observaciones,
                        pais:pais,
                        servicio_boletos:servicio_boletos,
                        servicio_costo_maestria:servicio_costo_maestria,
                        servicio_inscripcion:servicio_inscripcion,
                        servicio_viaticos:servicio_viaticos
                    }
                }
            );

            return "Modificacion exitosa";
        }

        return "Modificacion fallida";
    }catch(e){
        console.log(e);
        winston.error("registrarAyudaEconomica update failed");
        return "Modificacion fallida";
    }

}

async function rechazaAyudaEconomica(preferencesObject){
    try{
        //validar fechas
        console.log(JSON.stringify(preferencesObject));
        if ((preferencesObject.id==null) ||(preferencesObject.id==="")){
            winston.info("ID no puede ser nulo");
            return "error";
        }

        await sequelize.query('CALL rechazaAyudaEconomica(:id_ayudaEconomica)',
            {
                replacements: {
                    id_ayudaEconomica:parseInt(preferencesObject.id),
                }
            }
        );
        mensaje ="AyudaEconomica rechazada correctamente "+ parseInt(preferencesObject.id);

        return mensaje;


    }catch(e){
        console.log(e);
        winston.error("AyudaEconomica failed");
        return "error";
    }
}

async function eliminarDocumentoGasto(preferencesObject){
    try{
        //validar fechas
        console.log(JSON.stringify(preferencesObject));
        if ((preferencesObject.id==null) ||(preferencesObject.id==="")){
            winston.info("ID no puede ser nulo");
            return "error";
        }

        await sequelize.query('CALL eliminaDocumentoGasto(:id_documentoGasto)',
            {
                replacements: {
                    id_documentoGasto:parseInt(preferencesObject.id),
                }
            }
        );
        mensaje ="DocumentoGasto eliminada correctamente "+ parseInt(preferencesObject.id);

        return mensaje;


    }catch(e){
        console.log(e);
        winston.error("DocumentoGasto failed");
        return "error";
    }
}

async function registraArchivo(data){
    try{
        let response = await sequelize.query(`call insertaArchivo('${data.originalname}','${data.path}','${data.mimetype}');`);
        console.log(response[0]);
        return response[0];
    }catch (e) {
        return "error";
    }
}

async function modificarArchivo(data,id){
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

module.exports  ={
    registrarAyudaEconomica:registrarAyudaEconomica,
    registrarDocumentoGasto:registrarDocumentoGasto,
    modificarAyudaEconomica:modificarAyudaEconomica,
    rechazaAyudaEconomica:rechazaAyudaEconomica,
    eliminarDocumentoGasto:eliminarDocumentoGasto,
    registraArchivo:registraArchivo,
    modificarArchivo:modificarArchivo
};
