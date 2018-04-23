var winston = require('../../config/winston');
var mysql = require('mysql');
const dbCon = require('../../config/db');
const Sequelize = require('sequelize');
const dbSpecs =  dbCon.connect();

const sequelize = new Sequelize(dbSpecs.db, dbSpecs.user, dbSpecs.password, {
    host: dbSpecs.host,
    dialect: dbSpecs.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

function queryDbList(id) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_LISTAR(:id)',
            {
                replacements: {
                    id: id
                }
            }
        );
        winston.info("queryDbList succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("queryDbList failed");
    }
}


function queryDbDetalle(id_profesor,id_curso,id_ciclo) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_DETALLE(:id_profesor,:id_curso,:id_ciclo)',
            {
                replacements: {
                    id_profesor: id_profesor,
                    id_curso: id_curso,
                    id_ciclo: id_ciclo
                }
            }
        );
        winston.info("queryDbDetalle succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("queryDbDetalle failed");
    }
}

function queryDbComments(id_profesor,id_curso,id_ciclo) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_COMENTARIOS(:id_profesor,:id_curso,:id_ciclo)',
            {
                replacements: {
                    id_profesor: id_profesor,
                    id_curso: id_curso,
                    id_ciclo: id_ciclo
                }
            }
        );
        winston.info("queryDbComents succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("queryDbComents failed");
    }
}


async function returnList(id_profesor) {
    let jsonBlock = {};
    try {
        winston.info("id_profesor : " + id_profesor);
        let jsonBlock = await queryDbList(id_profesor);
        winston.info("returnList succesful");
        return jsonBlock;
    } catch (e){
        console.log(e);
        winston.error("returnList failed");
    }
}


async function returnDet(id_profesor,id_curso,id_ciclo) {
    let jsonBlock = {};
    try {
        winston.info("id_profesor : " + id_profesor);
        winston.info("id_curso : " + id_curso);
        winston.info("id_ciclo : " + id_ciclo);
        let jsonBlock = await queryDbDetalle(id_profesor,id_curso,id_ciclo);
        winston.info("returnDet succesful");
        return jsonBlock;
    } catch (e){
        console.log(e);
        winston.error("returnDet failed");
    }
}


async function returnComment(id_profesor,id_curso,id_ciclo) {
    let jsonBlock = {};
    try {
        winston.info("id_profesor : " + id_profesor);
        winston.info("id_curso : " + id_curso);
        winston.info("id_ciclo : " + id_ciclo);
        let jsonBlock = await queryDbComments(id_profesor,id_curso,id_ciclo);
        winston.info("returnComment succesful");
        return jsonBlock;
    } catch (e){
        console.log(e);
        winston.error("returnComment failed");
    }
}

module.exports = {
    returnList: returnList,
    returnDet: returnDet,
    returnComment: returnComment
}