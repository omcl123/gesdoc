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


async function docentesTipoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL docentes_tipo_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}

async function actividadesTipoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL actividades_tipo_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoEstadoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL ayuda_economica_estado_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}

async function convocatoriaEstadoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL convocatoria_estado_seccion(${preferencesObject.idSeccion})`);
    }catch (e) {
        return "error";
    }
}


async function docentesTipoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL docentes_tipo_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function actividadesTipoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL actividades_tipo_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoEstadoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL ayuda_economica_estado_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function convocatoriaEstadoDepartamento(preferencesObject, unidad){
    try{
        return await sequelize.query(`CALL convocatoria_estado_departamento(${unidad})`);
    }catch (e) {
        return "error";
    }
}

async function investigacionesAnoDepartamento(preferencesObject,unidad){
    try{
        return await sequelize.query(`CALL investigaciones_ano_departamento(${unidad},'${preferencesObject.anho}')`);
    }catch (e) {
        return "error";
    }
}

async function investigacionesAnoSeccion(preferencesObject){
    try{
        return await sequelize.query(`CALL investigaciones_ano_seccion(${preferencesObject.idSeccion},'${preferencesObject.anho}')`);
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoAnoDepartamento(preferencesObject,unidad){
    try{
        let response= await sequelize.query(`CALL apoyo_ano_departamento(${unidad},'${preferencesObject.anho}')`);
        return await Promise.all(response.map(async (item) => {
            let newPart={};
            newPart.mes = item.mes;
            console.log(item);
            if (item.apoyo !== null){
                newPart.apoyo = item.apoyo;
            } else{
                newPart.apoyo = 0;
            }
            return newPart;
        }));
    }catch (e) {
        return "error";
    }
}

async function apoyoEconomicoAnoSeccion(preferencesObject){
    try{
        let response= await sequelize.query(`CALL apoyo_ano_seccion(${preferencesObject.idSeccion},'${preferencesObject.anho}')`);
        return await Promise.all(response.map(async (item) => {
            let newPart={};
            newPart.mes = item.mes;
            console.log(item);
            if (item.apoyo !== null){
                newPart.apoyo = item.apoyo;
            } else{
                newPart.apoyo = 0;
            }
            return newPart;
        }));
    }catch (e) {
        return "error";
    }
}

async function listaCargaHorariaSeccion(preferencesObject){
    try{
        let docenteSeccion = await sequelize.query(`CALL listaDocenteSeccion(${preferencesObject.id})`);
        console.log(docenteSeccion);
        let array={};
        return Promise.all(docenteSeccion.map(async (item) =>{
            try{
                let jsonLista = {};
                let response = await sequelize.query(`call devuelveDocente(${item.codigo})`);
                jsonLista.seccion=item.nombre;
                jsonLista.tipoProf = response[0].descripcion;
                jsonLista.nombreCompleto = response[0].nombres + " " +response[0].apellido_paterno+ " " +response[0].apellido_materno;

                if ( response[0].descripcion === "TC"){
                    let datosCiclo =  await sequelize.query(`call devuelveDatosCiclo('${preferencesObject.ciclo}')`);
                    jsonLista.horasRequeridas = datosCiclo[0].numero_semanas * 10;
                    let horasPorCurso =
                        await sequelize.query(`call devuelveHorasCursoDocente(${response[0].id},${datosCiclo[0].id})`);
                    jsonLista.horasPorCurso = horasPorCurso[0].total * 10;
                    let horasDescarga =
                        await sequelize.query(`call devuelveHorasDescargaDocente(${response[0].id},${datosCiclo[0].id})`);
                    jsonLista.horasDescarga = horasDescarga[0].total*1;
                    jsonLista.horasDeuda = (datosCiclo[0].numero_semanas * 10)-(horasPorCurso[0].total * 10)+(horasDescarga[0].total*1);
                } else{
                    console.log("TPA");
                }
                console.log(jsonLista);
                return jsonLista;
            }catch (e) {
                "error"
            }
        }));
    }catch (e) {
        return "error";
    }
}

async function listaCargaHorariaDepartamento(preferencesObject){
    try{
        let response= await sequelize.query(`CALL apoyo_ano_seccion(${preferencesObject.idSeccion},'${preferencesObject.anho}')`);
        return await Promise.all(response.map(async (item) => {
            let newPart={};
            newPart.mes = item.mes;
            console.log(item);
            if (item.apoyo !== null){
                newPart.apoyo = item.apoyo;
            } else{
                newPart.apoyo = 0;
            }
            return newPart;
        }));
    }catch (e) {
        return "error";
    }
}

module.exports = {
    docentesTipoDepartamento:docentesTipoDepartamento,
    actividadesTipoDepartamento:actividadesTipoDepartamento,
    apoyoEconomicoEstadoDepartamento:apoyoEconomicoEstadoDepartamento,
    convocatoriaEstadoDepartamento:convocatoriaEstadoDepartamento,
    docentesTipoSeccion:docentesTipoSeccion,
    actividadesTipoSeccion:actividadesTipoSeccion,
    apoyoEconomicoEstadoSeccion:apoyoEconomicoEstadoSeccion,
    convocatoriaEstadoSeccion:convocatoriaEstadoSeccion,
    investigacionesAnoDepartamento:investigacionesAnoDepartamento,
    investigacionesAnoSeccion:investigacionesAnoSeccion,
    apoyoEconomicoAnoDepartamento:apoyoEconomicoAnoDepartamento,
    apoyoEconomicoAnoSeccion:apoyoEconomicoAnoSeccion,
    listaCargaHorariaSeccion:listaCargaHorariaSeccion,
    listaCargaHorariaDepartamento:listaCargaHorariaDepartamento
};
