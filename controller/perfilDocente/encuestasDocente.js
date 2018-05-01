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

function queryListaEncuestas(preferencesObject) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_LISTAR_CICLO(:codigo,:ciclo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo, // codigo del profesor
                    ciclo: preferencesObject.ciclo
                }
            }
        );
        winston.info("queryListaEncuestas succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("queryListaEncuestas failed");
    }
}

function queryListaEncuestasAll(preferencesObject) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_LISTAR(:codigo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo // codigo del profeso
                }
            }
        );
        winston.info("queryListaEncuestas succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("queryListaEncuestas failed");
    }
}


function queryListaComentarios(preferencesObject,id_curso,ciclo) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_COMENTARIOS(:codigo,:ciclo,:id_curso)',
            {
                replacements: {
                    codigo: preferencesObject.codigo,
                    ciclo: ciclo,
                    id_curso: id_curso
                }
            }
        );
        winston.info("queryListaComentarios succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("queryListaComentarios failed");
    }
}

async function listaEnAll(preferencesObject){
    try {
        console.log("ALL");
        let jsonEncuestas = await queryListaEncuestasAll(preferencesObject);


        let jsonEncuestasComentarios = Promise.all(jsonEncuestas.map(async item => {
            let innerPart = {};
            innerPart.id = item.id;
            innerPart.curso = item.curso;
            innerPart.horario = item.horario;
            innerPart.porcentaje = item.porcentaje;
            innerPart.puntaje = item.puntaje;
            let listaComentarios = await queryListaComentarios(preferencesObject,item.id_curso,item.ciclo);
            innerPart.comentarios = listaComentarios;
            return innerPart;
        }));

        return jsonEncuestasComentarios;



    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

async function listaEnxCiclo(preferencesObject){
    try {
        console.log("XCICLO");
        let jsonEncuestas = await queryListaEncuestas(preferencesObject);


        let jsonEncuestasComentarios = Promise.all(jsonEncuestas.map(async item => {
            let innerPart = {};
            innerPart.id = item.id;
            innerPart.curso = item.curso;
            innerPart.horario = item.horario;
            innerPart.ciclo = item.ciclo;
            innerPart.porcentaje = item.porcentaje;
            innerPart.puntaje = item.puntaje;
            let listaComentarios = await queryListaComentarios(preferencesObject,item.id_curso,item.ciclo);
            innerPart.comentarios = listaComentarios;
            return innerPart;
        }));

        return jsonEncuestasComentarios;



    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

async function listaEncuestas(preferencesObject) {
    try{
        let c = preferencesObject.ciclo;
        console.log(c);

        if (c == "all"){
            return await listaEnAll(preferencesObject);
        }else{
            return await listaEnxCiclo(preferencesObject);
        }
    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

module.exports ={
    listaEncuestas:listaEncuestas
}
