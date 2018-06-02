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

async function listaDocente() {

    try {
        let response = await sequelize.query('CALL listaDocentes()');
        console.log(response);
        winston.info("muestraCursosCiclo success");
        return response;
    } catch(e) {
        winston.error("muestraCursosCiclo Failed: ",e);
        return "error";
    }
}

async function listaCiclos() {

    try {
        let response = await sequelize.query('CALL listaCiclos()');
        console.log(response);
        winston.info("listaCiclos success");
        return response;
    } catch(e) {
        winston.error("listaCiclos Failed: ",e);
        return "error";
    }
}

async function listaSeccciones() {

    try {
        let response = await sequelize.query('CALL lista_secciones()');
        console.log(response);
        winston.info("listaSeccciones success");
        return response;
    } catch(e) {
        winston.error("listaSeccciones Failed: ",e);
        return "error";
    }
}

async function listaMotivosAyudaEc() {

    try {
        let response = await sequelize.query('CALL lista_motivos()');
        console.log(response);
        winston.info("listaMotivosAyudaEc success");
        return response;
    } catch(e) {
        winston.error("listaMotivosAyudaEc Failed: ",e);
        return "error";
    }
}

async function listaEstadosAyudaEc() {

    try {
        let response = await sequelize.query('CALL lista_estados_ayuda_economica()');
        console.log(response);
        winston.info("listaEstadosAyudaEc success");
        return response;
    } catch(e) {
        winston.error("listaEstadosAyudaEc Failed: ",e);
        return "error";
    }
}

async function cicloActual(){
    try {
        let currentDate = new Date();
        console.log(currentDate);
        let day = currentDate.getDate();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();
        let response = await sequelize.query(`CALL encuentra_ciclo('${day}-${month}-${year}')`);
        console.log(response);
        winston.info("cicloActual success");
        return response[0].descripcion;
    } catch(e) {
        winston.error("cicloActual Failed: ",e);
        return "error";
    }
}

async function listaTipoDocumento(){
    try{
        let tipo_documentos= await sequelize.query('call devuelveTipoDocumento()');
        console.log(tipo_documentos);
        winston.info("listaTipoDocumento success");
        return tipo_documentos;
    } catch( e){
        winston.error("listaTipoDocumento failed: ",e);
        return "error";

    }
}
async function listaPais(){
    try{
        let paises= await sequelize.query('call devuelvePais()');
        console.log(paises);
        winston.info("listaPais success");
        return paises;
    } catch( e){
        winston.error("listaPais failed: ",e);
        return "error";

    }
}
async function listaCurso(){
    try{
        let cursos= await sequelize.query('call devuelveCurso()');
        console.log(cursos);
        winston.info("listaCurso success");
        return cursos;
    } catch( e){
        winston.error("listaCurso failed: ",e);
        return "error";

    }
}

async function listaTipoUsuarios(){
    try{
        return await sequelize.query('call lista_tipo_usuarios()');
    } catch( e){
        winston.error("listaTipoUsuarios failed: ",e);
        return "error";

    }
}

async function listaDepartamentos(){
    try{
        return await sequelize.query('call lista_departamentos()');
    } catch( e){
        winston.error("listaDepartamentos failed: ",e);
        return "error";

    }
}

async function listaSecciones(req){
    try{
        return await sequelize.query(`call lista_secciones('${req.departamento}')`);
    } catch( e){
        winston.error("listaSecciones failed: ",e);
        return "error";

    }
}

async function listaTipoActividad(req){
    try{
        return await sequelize.query(`call lista_actividades()`);
    } catch( e){
        winston.error("lista_actividades failed: ",e);
        return "error";

    }
}

async function listaProfesoresSeccion(preferencesObject){
    try{
        let profesores_seccion=await sequelize.query('call devuelveProfesoresSeccion(:seccion)',{
            replacements:{
                seccion:preferencesObject.seccion
            }

        });
        winston.info("listaProfesoresSeccion success");
        return profesores_seccion;
    }catch(e){
        winston.error("listaProfesoresSeccion failed",e);
        return "error";
    }
}
async function listaProfesoresTipo(preferencesObject){
    try{
        let profesores_seccion=await sequelize.query('call devuelveProfesoresTipo(:tipo)',{
            replacements:{
                tipo:preferencesObject.tipo
            }

        });

        winston.info("listaProfesoresTipo success");
        return profesores_seccion;
    }catch(e){
        winston.error("listaProfesoresTipo failed",e);
        return "error";
    }
}
module.exports = {
    listaDocente: listaDocente,
    listaCiclos: listaCiclos,
    listaSeccciones: listaSeccciones,
    listaEstadosAyudaEc: listaEstadosAyudaEc,
    listaMotivosAyudaEc: listaMotivosAyudaEc,
    cicloActual: cicloActual,
    listaCurso:listaCurso,
    listaPais:listaPais,
    listaTipoDocumento:listaTipoDocumento,
    listaTipoUsuarios:listaTipoUsuarios,
    listaDepartamentos:listaDepartamentos,
    listaSecciones:listaSecciones,
    listaProfesoresSeccion:listaProfesoresSeccion,
    listaProfesoresTipo:listaProfesoresTipo,
    listaTipoActividad:listaTipoActividad
};