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

async function listaDocente(verifiedUser) {

    try {
        let response = await sequelize.query(`CALL listaDocentes(${verifiedUser.tipo_query},${verifiedUser.unidad})`);
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

async function listaSecccionesDep(bodyObject) {


    try {

        let user = await bodyObject.verifiedUser;

        console.log(user);


        let response = await sequelize.query(`call lista_seccionesDep(:tipo_query,:id_unidad)`,
            {
                replacements: {

                    tipo_query:user.tipo_query,
                    id_unidad:user.unidad

                }
            });




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

async function listarDepartamentos(){
    try{
        return await sequelize.query('call lista_departamentos()');
    } catch( e){
        winston.error("listaDepartamentos failed: ",e);
        return "error";

    }
}

async function listarSeccionesDep(prefenecesObject){
    try{
        return await sequelize.query(`call listar_secciones_dep(${prefenecesObject.id})`);
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
async function listaProfesoresW(preferencesObject){
    try{
        let profesores=await sequelize.query('call devuelveProfesores(:seccion,:tipo)',{
            replacements:{
                tipo:preferencesObject.tipo,
                seccion:preferencesObject.seccion,
            }

        });

        winston.info("listaProfesoresW success");
        return profesores;
    }catch(e){
        winston.error("listaProfesoresW failed",e);
        return "error";
    }
}
async function listaDocumentoPagoTipo(preferencesObject){
    try{
        let tipos=await sequelize.query('call devuelveDocumentoPagoTipo()');

        winston.info("listaAEArchivoTipo success");
        return tipos;
    }catch(e){
        winston.error("listaAEArchivoTipo failed",e);
        return "error";
    }
}

async function listaCursosSeccion(preferencesObject){
    try{
        let cursos_seccion=await sequelize.query('call devuelveCursosSeccion(:seccion)',{
            replacements:{
                seccion:preferencesObject.seccion
            }

        });
        winston.info("cursos_seccion success");
        return cursos_seccion;
    }catch(e){
        winston.error("cursos_seccion failed",e);
        return "error";
    }
}


async function listaInvestigacionDep(preferencesObject,bodyObject){
    try{

        let user = await bodyObject.verifiedUser;


        console.log(user);
        console.log(user.unidad);

        let inv_dep=await sequelize.query('call devuelveInvestigacionDep(:departamento)',{
            replacements:{
                departamento:user.unidad
            }

        });
        winston.info("listaInvestigacionDep success");


        let jsonlistaInvestigacionDep = Promise.all(inv_dep.map(async item => {
            let innerPart = {};
            innerPart.id = item.id;
            innerPart.titulo = item.titulo;
            innerPart.resumen = item.resumen;
            innerPart.fecha_inicio = item.fecha_inicio;
            innerPart.fecha_fin = item.fecha_fin;
            innerPart.estado = item.estado;

            let profesores = await await sequelize.query('call devuelveProfInvestigacionDep(:id)',{
                replacements:{
                    id:item.id
                }

            });
            innerPart.profesores = profesores;
            return innerPart;
        }));

        return jsonlistaInvestigacionDep;



    }catch(e){
        winston.error("listaInvestigacionDep failed",e);
        return "error";
    }
}



async function listaInvestigacionSec(preferencesObject){
    try{


        let inv_dep=await sequelize.query('call devuelveInvestigacionSec(:seccion)',{
            replacements:{
                seccion:preferencesObject.seccion
            }

        });
        winston.info("listaInvestigacionSec success");


        let jsonlistaInvestigacionDep = Promise.all(inv_dep.map(async item => {
            let innerPart = {};
            innerPart.id = item.id;
            innerPart.titulo = item.titulo;
            innerPart.resumen = item.resumen;
            innerPart.fecha_inicio = item.fecha_inicio;
            innerPart.fecha_fin = item.fecha_fin;
            innerPart.estado = item.estado;

            let profesores = await await sequelize.query('call devuelveProfInvestigacionDep(:id)',{
                replacements:{
                    id:item.id
                }

            });
            innerPart.profesores = profesores;
            return innerPart;
        }));

        return jsonlistaInvestigacionDep;



    }catch(e){
        winston.error("listaInvestigacionDep failed",e);
        return "error";
    }
}

async function descargaArchivo(preferencesObject){
    try{
        let response=await sequelize.query(`call desvuelveArchivo(${preferencesObject.id})`);
        return response[0];
    }catch(e){
        return "error";
    }
}


async function listaUsuarios(preferencesObject){
    try{
        let response=await sequelize.query(`call lista_usuarios()`);
        }
    catch(e){
        return "error";
    }
}

async function listaTipo_profesor(){
    try{
        let response = await sequelize.query(`select * from tipo_profesor`)

        return response;
    }catch(e){
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
    listaSecccionesDep:listaSecccionesDep,
    listaProfesoresSeccion:listaProfesoresSeccion,
    listaProfesoresTipo:listaProfesoresTipo,
    listaTipoActividad:listaTipoActividad,
    listaProfesoresW:listaProfesoresW,
    listaDocumentoPagoTipo:listaDocumentoPagoTipo,
    listaCursosSeccion:listaCursosSeccion,
    listaInvestigacionDep:listaInvestigacionDep,
    listaInvestigacionSec:listaInvestigacionSec,
    descargaArchivo:descargaArchivo,
    listarSeccionesDep:listarSeccionesDep,
    listarDepartamentos:listarDepartamentos,
    listaUsuarios:listaUsuarios
};
