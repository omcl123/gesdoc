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
    let docentesCiclo1 = await sequelize.query(`CALL lista_docente_curso_preferencia_ciclo1('${codCurso}');`);
    let docentesCiclo2 = await sequelize.query(`CALL lista_docente_curso_preferencia_ciclo2('${codCurso}');`);

    let subtract = new Subtract((itemA, itemB) => { return itemA.codigo === itemB.codigo });
    let difCiclo1 = subtract.sub(docentesCiclo1,docentesCiclo2);
    console.log(difCiclo1);
    let interseccion = subtract.sub(docentesCiclo1,difCiclo1);
    console.log(interseccion);
    let difCiclo2 = subtract.sub(docentesCiclo2,docentesCiclo1);
    console.log(difCiclo2);



}

async function getCoursesbyTeacherPreference() {
    try {
        let courseArray = await sequelize.query('call lista_resultados_curso_preferencias();');
        await courseArray.map(async item =>{
            let partObject = {};
            partObject.codigo = item.codigo;
            partObject.seccion = item.seccion;
            partObject.nombreCurso = item.nombreCurso;
            partObject.claseCurso = item.claseCurso;
            partObject.profesorPreferencia = await getPreferencebyTeacher(item.codigo);
            return partObject;
        });
        return courseArray;
    } catch(e){

    }
}

async function listaCursoDisponible(preferencesObject) {
    let jsonBlock = {};
    jsonBlock.cursos = await sequelize.query(preferencesObject);
    return jsonBlock;
}

async function consultaPreferencias(preferencesObject){
    let jsonBlock = {};
    jsonBlock.cursos = await getCoursesbyTeacherPreference();
    return jsonBlock;
}

async function getHorariosbyTeacherPreference(preferencesObject) {
    try {
        let horariosArray = await sequelize.query();
        await horariosArray.map(async item => {
            try {
                let partHorarios = {};
                partHorarios.numHorario = item.numHorario;
                partHorarios.docentesInscritos = await sequelize.query();
                return partHorarios;
            }catch (e){
                return e;
            }
        });
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