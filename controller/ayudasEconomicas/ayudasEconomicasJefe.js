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

//CODIGO DE  MOISES
function prueba (preferencesObject){
    return "prueba";
}

async function devuelveAyudasEconomicas(preferencesObject){
    try{
        let jsonAyudaEconomica
        console.log(preferencesObject.ciclo);
        let ciclo = await sequelize.query(`call devuelveIdCiclo(:ciclo)`,
            {
                replacements:{
                    ciclo:preferencesObject.ciclo
                }
            }
            );

        if (ciclo == undefined || ciclo[0]==undefined || ciclo.length==0)
            return -1;
        else {


            console.log(ciclo);
            let ayudas=await sequelize.query(`call devuelveAyudasEconomicas(:ciclo)`,
                {
                    replacements:{
                        ciclo:preferencesObject.ciclo
                    }
                });
            console.log(JSON.stringify(ayudas));
            jsonAyudaEconomica = await Promise.all(ayudas.map(async item =>{
                let innerPart ={};
                let profesor={};

                innerPart.id=item.id;
                innerPart.codigo_solicitud=item.codigo_solicitud;
                innerPart.id_investigacion=item.id_investigacion;
                innerPart.titulo=item.titulo;
                innerPart.motivo=item.motivo;
                innerPart.monto_otorgado=item.monto_otorgado;
                innerPart.estado=item.estado;
                innerPart.fecha_solicitud=item.fecha_solicitud;

                profesor.codigo_profesor=item.codigo_profesor;
                profesor.nombres=item.nombres;
                profesor.apellido_paterno=item.apellido_paterno;
                profesor.apellido_materno=item.apellido_materno;
                profesor.correo_pucp=item.correo_pucp;
                profesor.tipo_profesor=item.tipo_profesor;
                profesor.seccion=item.seccion;

                innerPart.profesor=profesor;
                return innerPart;

            }));

            winston.info("devuelveAyudasEconomicas successful");
            return jsonAyudaEconomica;
        }

    }catch(e){
        winston.error("devuelveAyudasEconomicas failed");
        return "error";
    }

}
async function devuelveAyudasEconomicasFiltro(preferencesObject){
    try{
        let ciclo = await sequelize.query(`call devuelveIdCiclo(:ciclo)`,
            {
                replacements:{
                    ciclo:preferencesObject.ciclo
                }
            }
        );
        if (ciclo == undefined || ciclo[0]==undefined || ciclo.length==0)
            return -1;
        else {
            let codigo_inv;
            let titulo;
            let codigo_profesor;
            let seccion;
            let motivo;
            let estado;
            let montoMin;
            let montoMax;
            let fecha_inicio;
            let fecha_fin;
            let codigo_ayuda;
            //console.log(preferencesObject);
            if (parseInt(preferencesObject.codigo_ayuda)==-1)
                codigo_ayuda=-1;
            else
                codigo_ayuda=preferencesObject.codigo_ayuda;
            if (parseInt(preferencesObject.codigo_inv) == -1)
                codigo_inv = -1;
            else
                codigo_inv = preferencesObject.codigo_inv;

            if (parseInt(preferencesObject.titulo) == -1)
                titulo = "";
            else
                titulo = preferencesObject.titulo;

            if (parseInt(preferencesObject.codigo_profesor) == -1)
                codigo_profesor = -1;
            else
                codigo_profesor = preferencesObject.codigo_profesor;

            if (parseInt(preferencesObject.seccion) == -1)
                seccion = "";
            else
                seccion = preferencesObject.seccion;

            if (parseInt(preferencesObject.motivo) == -1)
                motivo = "";
            else
                motivo = preferencesObject.motivo;

            if (parseInt(preferencesObject.estado) == -1)
                estado = "";
            else
                estado = preferencesObject.estado;

            if (parseInt(preferencesObject.montoMin) == -1)
                montoMin = -1;
            else
                montoMin = preferencesObject.montoMin;

            if (parseInt(preferencesObject.montoMax) == -1)
                montoMax = -1;
            else
                montoMax = preferencesObject.montoMax;

            if (parseInt(preferencesObject.fecha_inicio) == -1)
                fecha_inicio = null;
            else
                fecha_inicio = preferencesObject.fecha_inicio;

            if (parseInt(preferencesObject.fecha_fin) == -1)
                fecha_fin = null;
            else
                fecha_fin = preferencesObject.fecha_fin;

            console.log(codigo_inv + " " + titulo + " " + codigo_profesor + " " + motivo + " " + estado + " " + montoMin + " " + montoMax + " " + fecha_inicio + " " + fecha_fin);
            let ayudas = await sequelize.query('call devuelveAEFiltro(:ciclo,:codigo_ayuda,:codigo_inv,:titulo,:profesor,:seccion,:motivo,:estado,:montoMin,:montoMax,:fecha_inicio,:fecha_fin)',
                {
                    replacements: {
                        codigo_inv: codigo_inv,
                        titulo: titulo,
                        profesor: codigo_profesor,
                        seccion: seccion,
                        motivo: motivo,
                        estado: estado,
                        montoMin: montoMin,
                        montoMax: montoMax,
                        fecha_inicio: fecha_inicio,
                        fecha_fin: fecha_fin,
                        codigo_ayuda:codigo_ayuda,
                        ciclo:preferencesObject.ciclo
                    }
                });
            winston.info("devuelveAyudasEconomicasFiltro success");

            let jsonAyudaEconomica = await Promise.all(ayudas.map(async item =>{
                let innerPart ={};
                let profesor={};

                innerPart.id=item.id;
                innerPart.codigo_solicitud=item.codigo_solicitud;
                innerPart.id_investigacion=item.id_investigacion;
                innerPart.titulo=item.titulo;
                innerPart.motivo=item.motivo;
                innerPart.monto_otorgado=item.monto_otorgado;
                innerPart.estado=item.estado;
                innerPart.fecha_solicitud=item.fecha_solicitud;

                profesor.codigo_profesor=item.codigo_profesor;
                profesor.nombres=item.nombres;
                profesor.apellido_paterno=item.apellido_paterno;
                profesor.apellido_materno=item.apellido_materno;
                profesor.correo_pucp=item.correo_pucp;
                profesor.tipo_profesor=item.tipo_profesor;
                profesor.seccion=item.seccion;

                innerPart.profesor=profesor;
                return innerPart;

            }));

            return jsonAyudaEconomica;
        }
    }catch (e){
        winston.error("devuelveAyudasEconomicasFiltro error");
        return "error";
    }
}
async function devuelveDetalleAyudaEconomica(preferencesObject){
    try{
        let ayudas = await sequelize.query('call devolverDetalleAyudaEconomica(:id_ayudaeconomica)',{
            replacements:{
                id_ayudaeconomica:preferencesObject.id
            }
        });
        let jsonAyudaEconomica = await Promise.all(ayudas.map(async item =>{
            let innerPart ={};
            let profesor={};

            innerPart.id=item.id;
            innerPart.id_investigacion=item.id_investigacion;
            innerPart.titulo=item.titulo;
            innerPart.motivo=item.motivo;
            innerPart.monto_otorgado=item.monto_otorgado;
            innerPart.fecha_solicitud=item.fecha_solicitud;
            innerPart.fecha_inicio=item.fecha_inicio;
            innerPart.fecha_fin=item.fecha_fin;
            innerPart.comentarios_adicionales=item.comentarios_adicionales;
            innerPart.servicio_boletos=item.servicio_boletos;
            innerPart.servicio_costo_maestria=item.servicio_costo_maestria;
            innerPart.servicio_inscripcion=item.servicio_inscripcion;
            innerPart.servicio_viaticos=item.servicio_viaticos;

            profesor.codigo_profesor=item.codigo_profesor;
            profesor.nombres=item.nombres;
            profesor.apellido_paterno=item.apellido_paterno;
            profesor.apellido_materno=item.apellido_materno;
            profesor.correo_pucp=item.correo_pucp;
            profesor.seccion=item.seccion;

            innerPart.profesor=profesor;
            return innerPart;

        }));
        return jsonAyudaEconomica[0];
    }catch(e){
        winston.error("devuelveAyudasEconomicasFiltro error");
        return "error";
    }
}
async function modificarAyudaEconomica(preferencesObject){
    try{
        await sequelize.query('call modificarAyudaEconomica(:id_ayudaeconomica,:estado_ayuda)',{
            replacements:{
                id_ayudaeconomica:preferencesObject.id,
                estado_ayuda:preferencesObject.estado_ayuda
            }
        });
        winston.info("modificarAyudaEconomica success");
        return "modificarAyudaEconomica success";
    }catch(e){
        winston.error("devuelveAyudasEconomicasFiltro error");
        return "error";
    }
}
async function devuelveAyudaEconomicaJustificacion(preferencesObject){
    try{
        let ayuda={};
        let ayudas =await  sequelize.query('call devolverDetalleAyudaEconomica(:id_ayuda)',{
            replacements: {
                id_ayuda:preferencesObject.id
            }
        });
        let jsonAyudaEconomica={};
         jsonAyudaEconomica = await Promise.all(ayudas.map(async item =>{
            let innerPart ={};
            let profesor={};
            let investigacion={};



            innerPart.id=item.id;
            innerPart.codigo=item.codigo;
            innerPart.motivo=item.motivo;
            innerPart.monto_otorgado=item.monto_otorgado;
            innerPart.fecha_solicitud=item.fecha_solicitud;
            innerPart.fecha_inicio=item.fecha_inicio;
            innerPart.fecha_fin=item.fecha_fin;
            innerPart.comentarios_adicionales=item.comentarios_adicionales;


            profesor.codigo_profesor=item.codigo_profesor;
            profesor.nombres=item.nombres;
            profesor.apellido_paterno=item.apellido_paterno;
            profesor.apellido_materno=item.apellido_materno;
            profesor.correo_pucp=item.correo_pucp;
            profesor.seccion=item.seccion;

            investigacion.id=item.id_investigacion;
            investigacion.titulo=item.titulo;

            innerPart.docenteSolicitante=profesor;
            innerPart.investigacion = investigacion;
            return innerPart;

        }));

         let gastos = await sequelize.query('call devolverJustificacionAyudaEconomica(:id_ayuda)',{
             replacements:{
                 id_ayuda:preferencesObject.id
             }
         });
         console.log(gastos);
         ayuda=jsonAyudaEconomica[0];
         ayuda.justificacion=gastos;

        return ayuda;
    }catch(e) {
        winston.error("devuelveAyudaEconomicaJustificacion");
        return "error";
    }
}
module.exports={
    devuelveAyudasEconomicas:devuelveAyudasEconomicas,
    devuelveAyudasEconomicasFiltro:devuelveAyudasEconomicasFiltro,
    devuelveDetalleAyudaEconomica:devuelveDetalleAyudaEconomica,
    modificarAyudaEconomica:modificarAyudaEconomica,
    devuelveAyudaEconomicaJustificacion:devuelveAyudaEconomicaJustificacion
}
