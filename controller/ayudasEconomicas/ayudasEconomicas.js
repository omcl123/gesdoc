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





module.exports  ={
    listaAyudasEconomicas:listaAyudasEconomicas,
    detalleAyudasEconomicas:detalleAyudasEconomicas
}
