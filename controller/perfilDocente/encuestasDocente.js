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

function queryDb(query) {
    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}


function queryDbDetalle(id) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_DETALLE(:id)',
            {
                replacements: {
                    id: id
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

function queryDbComments(id) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_COMENTARIOS(:id)',
            {
                replacements: {
                    id: id
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


async function returnList() {
    let jsonBlock = {};
    try {
        let query = `CALL ENCUESTA_LISTAR()`;
        let jsonBlock = await queryDb(query);
        winston.info("returnList succesful");
        return jsonBlock;
    } catch (e){
        console.log(e);
        winston.error("returnList failed");
    }
}


async function returnDet(id) {
    let jsonBlock = {};
    try {
        winston.info("id : " + id);
        let jsonBlock = await queryDbDetalle(id);
        winston.info("returnDet succesful");
        return jsonBlock;
    } catch (e){
        console.log(e);
        winston.error("returnDet failed");
    }
}


async function returnComment(id) {
    let jsonBlock = {};
    try {
        winston.info("id : " + id);
        let jsonBlock = await queryDbComments(id);
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