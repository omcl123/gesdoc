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

async function listaAyudasEconomicas(preferencesObject){
    try {
        let convocatoria = await sequelize.query('CALL listaAyudasEconomicas()');

        console.log(convocatoria);

        let jsonlistaAyudasEconomicas= await Promise.all(convocatoria.map(async item => {
            let innerPart={};
            innerPart.id=item.id;
            innerPart.codigo=item.codigo;
            innerPart.nombre=item.nombre + ' ' + item.ap_paterno + ' ' + item.ap_materno;
            innerPart.motivo = item.motivo;
            innerPart.fecha = item.fecha;
            innerPart.estado = item.estado;
            innerPart.monto = item.monto;

            return innerPart;
        }));

        return jsonlistaAyudasEconomicas;

    }catch(e){
        console.log(e);
        winston.error("listaAyudasEconomicas failed");
        return -1;
    }


}


async function detalleAyudasEconomicas(preferencesObject){

    try {
        let convocatoria = await sequelize.query('CALL detalleAyudaEconomica(:in_ayudaEconomica)',
            {
                replacements: {
                    in_ayudaEconomica: preferencesObject.id

                }
            }
        );

        console.log (convocatoria);

        let list_just = await sequelize.query('CALL listaDocAyudaEconomica(:in_ayudaEconomica)',
            {
                replacements: {
                    in_ayudaEconomica: preferencesObject.id

                }
            }
        );

        console.log (list_just);

        let jsondetalleAyudasEconomicas= await Promise.all(convocatoria.map(async item => {
            let innerPart={};
            innerPart.id=item.id;
            innerPart.codigo=item.codigo;
            innerPart.nombre=item.nombre + ' ' + item.ap_paterno + ' ' + item.ap_materno;
            innerPart.motivo = item.motivo;
            innerPart.monto_otorgado = item.monto_otorgado;
            innerPart.monto_justificado = item.monto_justificado;

            innerPart.documentos = await Promise.all(list_just.map(async item2 => {
                let innerPart2={};
                innerPart2.id = item2.id;
                innerPart2.numero_documento = item2.numero_documento;
                innerPart2.tipo = item2.tipo;
                innerPart2.detalle = item2.detalle;
                innerPart2.monto = item2.monto;
                innerPart2.observaciones = item2.observaciones;
                return innerPart2;
            }));

            return innerPart;
        }));

        return jsondetalleAyudasEconomicas;
    }catch(e){
        console.log(e);
        winston.error("listaAyudasEconomicas failed");
        return -1;
    }

}

function convertirFecha(date){
    //20180429

    let year = Math.trunc(date / 10000);
    let month = Math.trunc((date - (10000 * year)) / 100);
    let day = date - (10000 * year) - (100 * month);
    let d = new Date(year + "-" + month + "-" + day);

    return (d);
}


async function insertaAyudaEconomica(preferencesObject){
    try {
        let motivo;

        let codigo_profesor;

        let monto;
        let fecha_i;
        let pais;
        let ciudad;
        //servicios
        let comentario;

        let inti_uni;

        if (preferencesObject.fecha_solicitud!=null) {
            console.log("fecha_solicitud NO es nulo");
            fecha_i = convertirFecha(preferencesObject.fecha_solicitud);
        }else{
            console.log("fecha_solicitud es nulo");
            winston.info("fecha_solicitud no puede ser nulo");
            fecha_i=null;
            return -1;
        }


        if (preferencesObject.motivo != null) {
            console.log("motivo NO es nulo");
            motivo = preferencesObject.motivo;
        } else {
            console.log("motivo es nulo");
            motivo = null;
        }

        if (preferencesObject.codigo_profesor != null) {
            console.log("codigo_profesor NO es nulo");
            codigo_profesor = preferencesObject.codigo_profesor;
        } else {
            console.log("codigo_profesor es nulo");
            codigo_profesor = null;
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



        if (motivo!=null&&codigo_profesor!=null&&monto!=null&&fecha_i!=null){
            await sequelize.query('CALL insertaAyudaEconomica(:codigo_profesor,:monto,:fecha_solicitud,:motivo,:comentario)',
                {

                    replacements: {
                        codigo_profesor:codigo_profesor,
                        monto:monto,
                        fecha_solicitud:fecha_i,
                        motivo:motivo,
                        comentario:comentario
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



module.exports  ={
    listaAyudasEconomicas:listaAyudasEconomicas,
    detalleAyudasEconomicas:detalleAyudasEconomicas,
    registrarAyudaEconomica:registrarAyudaEconomica,
    registrarDocumentoGasto:registrarDocumentoGasto
}
