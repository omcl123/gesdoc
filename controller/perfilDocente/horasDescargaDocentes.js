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


function horasDescargaDetalle(preferencesObject,id_curso,ciclo) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_DETALLE(:codigo,:ciclo,:id_curso)',
            {
                replacements: {
                    codigo: preferencesObject.codigo,
                    ciclo: ciclo,
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
        let result =  sequelize.query('CALL HORAS_DESCARGA_LISTAR_CICLO(:codigo,:ciclo)',
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

function horasDescargaListarAll(preferencesObject) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_LISTAR(:codigo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo
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


async function hDescAll(preferencesObject){
    try {

        let jsonHorasDescargaListar = await horasDescargaListarAll(preferencesObject);

        let jsonHorasDescargaDetalle = Promise.all(jsonHorasDescargaListar.map(async item => {
            let innerPart = {};
            innerPart.nombre = item.nombre;
            innerPart.codigo = item.codigo;
            //innerPart.hDictadas = item.hDictadas;
            innerPart.hDescargaTotal = item.hDescarga;
            let listaSemanal = await horasDescargaDetalle(preferencesObject,item.id_curso,item.ciclo);
            innerPart.semana = listaSemanal;
            return innerPart;
        }));

        return jsonHorasDescargaDetalle;

    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

async function hDescCiclo(preferencesObject){
    try {

        let jsonHorasDescargaListar = await horasDescargaListar(preferencesObject);

        let jsonHorasDescargaDetalle = Promise.all(jsonHorasDescargaListar.map(async item => {
            let innerPart = {};
            innerPart.nombre = item.nombre;
            innerPart.codigo = item.codigo;
            //innerPart.hDictadas = item.hDictadas;
            innerPart.hDescargaTotal = item.hDescarga;
            let listaSemanal = await horasDescargaDetalle(preferencesObject,item.id_curso,item.ciclo);
            innerPart.semana = listaSemanal;
            return innerPart;
        }));

        return jsonHorasDescargaDetalle;

    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

async function horasDescarga(preferencesObject) {
    try{
        let c = preferencesObject.ciclo;
        console.log(c);

        if (c == "all"){
            return await hDescAll(preferencesObject);
        }else{
            return await hDescCiclo(preferencesObject);
        }
    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}


async function insertaHoraDescDocente(preferencesObject){
    console.log("Comienza insertaHoraDescDocente");
    let horas_reducidas;
    let codigo_profesor;
    let codigo_horario;
    let ciclo;
    let codigo_curso;
    let numero_semana;
    let motivo;
    let observaciones;



    if (preferencesObject.horas_reducidas != null) {
        console.log("horas_reducidas NO es nulo");
        horas_reducidas = preferencesObject.horas_reducidas;
    } else {
        console.log("horas_reducidas es nulo");
        horas_reducidas = null;
    }

    if (preferencesObject.codigo_profesor != null) {
        console.log("codigo_profesor NO es nulo");
        codigo_profesor = preferencesObject.codigo_profesor;
    } else {
        console.log("codigo_profesor es nulo");
        codigo_profesor = null;
    }

    if (preferencesObject.codigo_horario != null) {
        console.log("codigo_horario NO es nulo");
        codigo_horario = preferencesObject.codigo_horario;
    } else {
        console.log("codigo_horario es nulo");
        codigo_horario = null;
    }

    if (preferencesObject.ciclo != null) {
        console.log("ciclo NO es nulo");
        ciclo = preferencesObject.ciclo;
    } else {
        console.log("ciclo es nulo");
        ciclo = null;
    }

    if (preferencesObject.codigo_curso != null) {
        console.log("codigo_curso NO es nulo");
        codigo_curso = preferencesObject.codigo_curso;
    } else {
        console.log("codigo_curso es nulo");
        codigo_curso = null;
    }

    if (preferencesObject.numero_semana != null) {
        console.log("numero_semana NO es nulo");
        numero_semana = preferencesObject.numero_semana;
    } else {
        console.log("numero_semana es nulo");
        numero_semana = null;
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

    try{

    if (horas_reducidas!=null || codigo_profesor!=null || codigo_horario!=null || ciclo!=null || codigo_curso!=null || numero_semana!=null || motivo!=null){
        await sequelize.query('CALL insertaHoraDescDocente(:horas_reducidas,:codigo_profesor,:codigo_horario,:ciclo,:codigo_curso,:numero_semana,:motivo,:observaciones)',
            {

                replacements: {
                    horas_reducidas:horas_reducidas,
                    codigo_profesor:codigo_profesor,
                    codigo_horario:codigo_horario,
                    ciclo:ciclo,
                    codigo_curso:codigo_curso,
                    numero_semana:numero_semana,
                    motivo:motivo,
                    observaciones:observaciones
                }
            }
        );
    }
    }catch (e){
        console.log(e);
        winston.error("registraHoraDescDocente failed");
        return -1;
    }


}


async function registraHoraDescDocente(preferencesObject){
    try {

        let last_id = -1;

        await insertaHoraDescDocente(preferencesObject);


        last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "descarga",
                }
            }
        );
        console.log("Convocatoria registrada correctamente");


        return last_id;

    }catch (e){
        console.log(e);
        winston.error("registraHoraDescDocente failed");
        return -1;
    }
}

module.exports  ={
    horasDescarga:horasDescarga,
    registraHoraDescDocente:registraHoraDescDocente
}

