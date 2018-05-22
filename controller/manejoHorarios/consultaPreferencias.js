const _ = require('lodash');

const winston = require('../../config/winston');
const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect();
const Subtract = require('array-subtract');
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


async function getPreferencebyTeacher(codCurso) {
    try{
        let docentesCiclo = await sequelize.query(`CALL lista_docente_curso_preferencia('${codCurso}');`);
        docentesCiclo =Promise.all( await docentesCiclo.map(async item =>{
            try{
                let partObject = {};
                console.log(item);
                if(item.codigo1 === null){
                    partObject.codigo = item.codigo2;
                }else {
                    partObject.codigo = item.codigo1;
                }
                if(item.nombre1 === null){
                    partObject.nombre = item.nombre2;
                }else {
                    partObject.nombre = item.nombre1;
                }
                if(item.tipo1 === null){
                    partObject.tipo = item.tipo2;
                }else {
                    partObject.tipo = item.tipo1;
                }
                if(item.ciclo1 != null){
                    partObject.ciclo1 = true;
                }else{
                    partObject.ciclo1 = false;
                }
                if(item.ciclo2 != null){
                    partObject.ciclo2 = true;
                }else{
                    partObject.ciclo2 = false;
                }
                return partObject
            }catch (e) {
                return "error";
            }

        }));
        return docentesCiclo;
    }catch(e){
        return"error";
    }

}

async function getCoursesbyTeacherPreference() {
    try {
        let courseArray = await sequelize.query('call lista_resultados_curso_preferencias();');
        courseArray = Promise.all(await courseArray.map(async item =>{
            let partObject = {};
            partObject.codigo = item.codigo;
            partObject.seccion = item.seccion;
            partObject.nombreCurso = item.nombre;
            partObject.claseCurso = item.clase;
            partObject.profesorPreferencia = await getPreferencebyTeacher(item.codigo);
            console.log(partObject);
            return partObject;
        }));
        return courseArray;
    } catch(e){

    }
}

async function listaCursoDisponible(preferencesObject) {
    let jsonBlock = {};
    jsonBlock.cursos = await sequelize.query(`call lista_cursos_disponible('${preferencesObject.ciclo}');`);
    return jsonBlock;
}

async function consultaPreferencias(preferencesObject){
    let jsonBlock = {};
    jsonBlock.cursos = await getCoursesbyTeacherPreference();
    return jsonBlock;
}

async function getHorariosbyTeacherPreference(preferencesObject) {
    try {
        let numHorarios = await
            sequelize.query(`call lista_horarios_curso_disponible('${preferencesObject.codCur}','${preferencesObject.ciclo}');`);
        console.log(numHorarios);
        let horariosArray=[];
        for(let i=0;i<numHorarios[0].horarios_disponibles;i++){
            let horario={};
            horario.numHorario = i+1;
            horariosArray.push(horario);
            console.log(horariosArray);
        }
        horariosArray= Promise.all(await horariosArray.map(async item => {
            try {
                let partHorarios = {};
                partHorarios.numHorario = item.numHorario;
                partHorarios.docentesInscritos =
                    await sequelize.query(`call docentes_inscritos_horario('${preferencesObject.codCur}','${preferencesObject.ciclo}',${item.numHorario});`);
                return partHorarios;
            }catch (e){
                return e;
            }
        }));
        return horariosArray;
    } catch(e){
        return "error";
    }
}

async function horariosCursosDisponible(preferencesObject){
    let jsonBlock = {};
    jsonBlock.horarios = await getHorariosbyTeacherPreference(preferencesObject);
    return jsonBlock;
}

module.exports ={
    consultaPreferencias:consultaPreferencias,
    listaCursoDisponible:listaCursoDisponible,
    horariosCursosDisponible:horariosCursosDisponible
};