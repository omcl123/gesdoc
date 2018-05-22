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

async function listaDocenteCargaAsignada(preferencesObject) {
    try{
        let jsonblock = {};
        let cargaArray = await sequelize.query(`call lista_docente_carga_asignada('${preferencesObject.ciclo}');`);
        cargaArray = Promise.all(cargaArray.map(async item =>{
            try{
                let cargaPart = {};
                cargaPart.tipo = item.tipo;
                cargaPart.codigo = item.codigo;
                cargaPart.nombre = item.nombre;
                cargaPart.horasRequeridas = item.horasRequeridas;
                let resumenCargaDocente =
                    await sequelize.query(`call resumen_carga_docente('${item.codigo}','${preferencesObject.ciclo}');`);
                cargaPart.numCursos = resumenCargaDocente[0].numCursos;
                if (resumenCargaDocente.numCursos === 0){
                    cargaPart.horasAsignadas = 0;
                }else{
                    cargaPart.horasAsignadas = resumenCargaDocente[0].horasAsignadas;
                }
                cargaPart.diferenciaHoras = item.horasRequeridas - resumenCargaDocente[0].horasAsignadas;
                return cargaPart;
            } catch (e){
                return "error";
            }
        }));
        jsonblock.docentes = await cargaArray;
        return jsonblock;
    } catch (e){
        return "error";
    }
}

async function detalleCargaDocenteAsignado(preferencesObject) {
    try {
        let jsonBlock = {};
        jsonBlock.cursos =
            await sequelize.query(`call detalle_carga_docente_asignado('${preferencesObject.codDocente}','${preferencesObject.ciclo}');`);
        return jsonBlock;
    } catch (e){
        return "error";
    }
}

module.exports ={
    listaDocenteCargaAsignada:listaDocenteCargaAsignada,
    detalleCargaDocenteAsignado:detalleCargaDocenteAsignado
};