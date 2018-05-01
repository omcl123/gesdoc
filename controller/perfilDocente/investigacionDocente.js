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

let Investigacion={};
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
        console.log(investigaciones);
        let jsonInvestigaciones = await Promise.all(investigaciones.map(async item => {
            let innerPart={};
            innerPart.id=item.id_investigacion;
            innerPart.titulo=item.titulo;
            innerPart.resumen=item.resumen;
            innerPart.estado=item.estado;
            innerPart.archivo=item.archivo;
            return innerPart;
        }));
        console.log(jsonInvestigaciones);
        winston.info("devuelveListaInvestigacion succesful");
        return jsonInvestigaciones;
        //return arregloInv;
    }catch(e){
        console.log(e);
        winston.error("devuelveListaInvestigacion failed");
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
async function registraInvestigacion(preferencesObject){

    try{
        let fecha_i ;
        let fecha_f;
        if (preferencesObject.fecha_inicio!=null) {
            console.log("Fecha inicio NO es nulo");
             fecha_i = await convertirFecha(preferencesObject.fecha_inicio);
        }else{
            console.log("Fecha inicio es nulo");
            fecha_i=null;
        }


        if (preferencesObject.fecha_fin != null) {
            console.log("Fecha fin NO es nulo");
             fecha_f =await  convertirFecha(preferencesObject.fecha_fin);
        } else {
            console.log("Fecha fin es nulo");
            fecha_f = null;
        }





         await sequelize.query('CALL insertaInvestigacion(:titulo,:resumen,:archivo,:fecha_inicio,:fecha_fin)',
            {

                replacements: {

                    titulo: preferencesObject.titulo,
                    resumen: preferencesObject.resumen,
                    fecha_inicio: fecha_i,
                    fecha_fin: fecha_f,
                    archivo: preferencesObject.archivo,
                }
            }
         );


        let last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "investigacion",
                }
            }
        );
        console.log("Investigacion registrada correctamente");
        //console.log(last_id[0].nuevo_id);


        let autores=[] ;
        let i;
        longitud=preferencesObject.autor.length;
        //console.log(longitud)
        for ( i =0; i<longitud;i++){

            await sequelize.query('CALL insertaAutorInvestigacion(:codigo_profesor,:id_investigacion)',
                {

                    replacements: {
                        codigo_profesor:preferencesObject.autor[i],
                        id_investigacion:last_id[0].nuevo_id
                    }
                }

            );
            console.log("Autor # "+i+ ": "+preferencesObject.autor[i]+" registrado correctamente");
            winston.info("registraInvestigaciones success on execution");
            let n_id=last_id[0].nuevo_id;
            return n_id;
        }
    }catch(e){
        console.log(e);
        winston.error("registraInvestigaciones failed");
        return -1;
    }
}
async function actualizaInvestigacion(preferencesObject){

    try{
        //validar fechas
        let fecha_i ;
        let fecha_f;
        if (preferencesObject.fecha_inicio!=null) {
            console.log("Fecha inicio NO es nulo");
            fecha_i = await convertirFecha(preferencesObject.fecha_inicio);
        }else{
            console.log("Fecha inicio es nulo");
            fecha_i=null;
        }

        let hay_fecha=1;
        if (preferencesObject.fecha_fin != null) {
            console.log("Fecha fin NO es nulo");
            fecha_f =await  convertirFecha(preferencesObject.fecha_fin);
            hay_fecha=1;
            await sequelize.query('CALL actualizaInvestigacion(:id_investigacion,:titulo,:resumen,:fecha_inicio,:fecha_fin,:archivo,:hayfecha)',
                {

                    replacements: {
                        id_investigacion:preferencesObject.id,
                        titulo: preferencesObject.titulo,
                        resumen: preferencesObject.resumen,
                        fecha_inicio: fecha_i,
                        fecha_fin: fecha_f,
                        archivo: preferencesObject.archivo,
                        hayfecha:hay_fecha
                    }
                }
            );

        } else {
            console.log("Fecha fin es nulo");
            fecha_f = null;
            hay_fecha=2;
            await sequelize.query('CALL actualizaInvestigacion(:id_investigacion,:titulo,:resumen,:fecha_inicio,:fecha_fin,:archivo,:hayfecha)',
                {
                    replacements: {
                        id_investigacion:parseInt(preferencesObject.id),
                        titulo: preferencesObject.titulo,
                        resumen: preferencesObject.resumen,
                        fecha_inicio: fecha_i,
                        fecha_fin: fecha_f,
                        archivo: preferencesObject.archivo,
                        hayfecha:hay_fecha
                    }
                }
            );
        }

        let i;
        longitud=preferencesObject.autor.length;


        mensaje ="investigacion actualizado correctamente "+ parseInt(preferencesObject.id);
        return mensaje;


    }catch(e){
        console.log(e);
        winston.error("registraInvestigaciones failed");
        return -1;
    }
}

async function eliminarInvestigacion(preferencesObject){

    try{
        //validar fechas

        await sequelize.query('CALL eliminaInvestigacion(:id_investigacion)',
            {
                replacements: {
                    id_investigacion:parseInt(preferencesObject.id),
                }
            }
        );
        mensaje ="investigacion eliminada correctamente "+ parseInt(preferencesObject.id);



        return mensaje;


    }catch(e){
        console.log(e);
        winston.error("registraInvestigaciones failed");
        return -1;
    }
}
module.exports ={
    devuelveListaInvestigacion:devuelveListaInvestigacion,
    registraInvestigacion:registraInvestigacion,
    actualizaInvestigacion:actualizaInvestigacion,
    eliminarInvestigacion:eliminarInvestigacion
}