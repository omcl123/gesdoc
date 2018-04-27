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


function horasDescargaDetalle(preferencesObject,id_curso) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_DETALLE(:codigo,:ciclo,:id_curso)',
            {
                replacements: {
                    codigo: preferencesObject.codigo,
                    ciclo: preferencesObject.ciclo,
                    id_curso: id_curso
                }
            }
        );
        winston.info("horasDescargaDetalle succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("horasDescargaDetalle failed");
    }
}

function horasDescargaListar(preferencesObject) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_LISTAR(:codigo,:ciclo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo,
                    ciclo: preferencesObject.ciclo
                }
            }
        );
        winston.info("horasDescargaListar succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("horasDescargaListar failed");
    }
}



async function horasDescarga(preferencesObject) {
    try {

        let jsonHorasDescargaListar = await horasDescargaListar(preferencesObject);

        let jsonHorasDescargaDetalle = Promise.all(jsonHorasDescargaListar.map(async item => {
            let innerPart = {};
            innerPart.nombre = item.nombre;
            innerPart.codigo = item.codigo;
            //innerPart.hDictadas = item.hDictadas;
            innerPart.hDescargaTotal = item.hDescarga;
            let listaSemanal = await horasDescargaDetalle(preferencesObject,item.id_curso);
            let innerPartSemana = {};
            innerPartSemana.numeroSemana = listaSemanal.numeroSemana;
            innerPartSemana.hDescarga = listaSemanal.hDescarga;
            innerPartSemana.motivo = listaSemanal.motivo;
            innerPart.semana = innerPartSemana;
            return innerPart;
        }));

        return jsonHorasDescargaDetalle;

    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}




module.exports  ={
    horasDescarga:horasDescarga
}
