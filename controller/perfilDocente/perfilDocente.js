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

function querydB(query){ //query inside the code


    return sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
}


async function devuelveDocente(){
    let jsonblock = {};
    try{
        let query = 'Call devuelveDocente()';
        let jsonBlock =await querydB(query); //calling sp from the db
        //let jsonBlock = sequelize.query(query,{type:Sequelize.QueryTypes.SELECT});
        winston.info("devuelveDocente succesful");
        return jsonBlock;

    }catch(e){
        console.log(e);
        winston.error("devuelveDocente failed");
    }
}



function queryListaEncuestas(preferencesObject) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_LISTAR(:id_curso)',
            {
                replacements: {
                    id_curso: preferencesObject.id_curso
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


function queryListaComentarios(preferencesObject) {
    try {
        let result =  sequelize.query('CALL ENCUESTA_COMENTARIOS(:id_profesor,:id_curso,:id_ciclo)',
            {
                replacements: {
                    id_profesor: preferencesObject.id_profesor,
                    id_curso: preferencesObject.id_curso,
                    id_ciclo: preferencesObject.id_ciclo
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



async function listaEncuestas(preferencesObject) {
    let jsonBlock = {};
    try {
        
        let jsonEncuestas = await queryListaEncuestas(preferencesObject);
		
		let jsonEncuestasComentarios = Promise.all(jsonEncuestas.map(async item => {
            let innerPart = {};
			innerPart.id = item.id;
			innerPart.curso = item.curso;
			innerPart.horario = item.horario;
			innerPart.porcentaje = item.porcentaje;
			innerPart.puntaje = item.puntaje;
            let listaComentarios = await queryListaComentarios(preferencesObject);
            innerPart.comentarios = listaComentarios;
            return innerPart;
        }));
		
		return jsonEncuestasComentarios;
		
    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

module.exports ={
    devuelveDocente:devuelveDocente
}