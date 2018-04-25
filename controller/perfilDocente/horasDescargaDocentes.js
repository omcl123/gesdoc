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


function horasDescargaDetalle(preferencesObject) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_DETALLE(:id_profesor,:id_curso,:id_ciclo)',
            {
                replacements: {
                    id_profesor: preferencesObject.id_profesor,
                    id_curso: preferencesObject.id_curso,
                    id_ciclo: preferencesObject.id_ciclo
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
        let result =  sequelize.query('CALL HORAS_DESCARGA_LISTAR(:id_profesor,:id_curso,:id_ciclo)',
            {
                replacements: {
                    id_profesor: preferencesObject.id_profesor,
                    id_curso: preferencesObject.id_curso,
                    id_ciclo: preferencesObject.id_ciclo
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
            let listaSemanal = await horasDescargaDetalle(preferencesObject);
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