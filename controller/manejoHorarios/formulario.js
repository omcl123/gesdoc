const winston = require('../../config/winston');
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

async function llenaPreferenciasFormulario(preferencesObject) {
    try{
        let codigoProf = preferencesObject.codigoProf;
        let arrayCursos = preferencesObject.cursos;
        await arrayCursos.map(async item =>{
            try {
                let codCurso = item.codigoCurso;
                let ciclo = item.ciclo;
                await sequelize.query(`CALL insert_curso_preferencia (${codigoProf},'${codCurso}','${ciclo}');`);
            } catch (e) {
                return "CALL insert_curso_preferencia Failed";
            }
        });
        return "insert succesfull";
    } catch (e){
        return "insert_curso_preferencia Failed";
    }
}


async function listaCursosFormulario() {
    let jsonBlock = {};
    try {
        jsonBlock.obligatorios = await sequelize.query(`CALL lista_obligatorios(4)`);
        jsonBlock.electivos = await sequelize.query(`CALL lista_electivos(4)`);
        return jsonBlock;
    } catch (e) {
        winston.error("listaCursosFormulario Failed: ",e);
        return "error";
    }
}

async function verificaCodigoDocente(preferencesObject,res) {
    try {
        let result = await sequelize.query(`CALL verifca_codigo_docente(${preferencesObject.codigo})`);
        console.log(result);
        if (result[0] !== undefined){
            return res.status(200).send({exists: true, nombre: result[0].nombre});

        }else{
            return res.status(500).send({exists: false, nombre: 'Can´t find user'});
        }
    } catch (e) {
        winston.error("verificaCodigoDocente Failed: ",e);
        return "error";
    }
}

module.exports ={
    listaCursosFormulario:listaCursosFormulario,
    llenaPreferenciasFormulario:llenaPreferenciasFormulario,
    verificaCodigoDocente:verificaCodigoDocente
};