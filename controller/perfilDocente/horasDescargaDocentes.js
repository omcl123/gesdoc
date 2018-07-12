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



async function horasTotalCalcular(data) {
    let key;
    let suma = 0;
    for(key in data) {
        if(data[key].estado === "Aprobada"){
            suma = suma + data[key].hDescarga;
            console.log(suma);
        }

    }
    return suma;

}


function horasDescargaDetalle(preferencesObject,id_curso,ciclo,estado) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_DETALLE(:codigo,:ciclo,:id_curso)',
            {
                replacements: {
                    codigo: preferencesObject.codigo,
                    ciclo: ciclo,
                    id_curso: id_curso
                }
            }
        );
        winston.info("horasDescargaDetalle succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("horasDescargaDetalle failed");
    }
}



function horasDescargaListar(preferencesObject) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_LISTAR_CICLO(:codigo,:ciclo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo,
                    ciclo: preferencesObject.ciclo
                }
            }
        );
        winston.info("horasDescargaListar succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("horasDescargaListar failed");
    }
}

function horasDescargaListarAll(preferencesObject) {
    try {
        let result =  sequelize.query('CALL HORAS_DESCARGA_LISTAR(:codigo)',
            {
                replacements: {
                    codigo: preferencesObject.codigo
                }
            }
        );
        winston.info("horasDescargaListar succesful");
        return result;
    } catch (e) {
        console.log(e);
        winston.error("horasDescargaListar failed");
    }
}


async function hDescAll(preferencesObject){
    try {

        let jsonHorasDescargaListar = await horasDescargaListarAll(preferencesObject);

        let jsonHorasDescargaDetalle = Promise.all(jsonHorasDescargaListar.map(async item => {
            let innerPart = {};
            innerPart.id_curso = item.id_curso;
            innerPart.curso = item.curso;
            innerPart.codigo = item.codigo;
            innerPart.ciclo = item.ciclo;
            innerPart.horario = item.horario;


            let horas_total = 0;
            let listaSemanal = await horasDescargaDetalle(preferencesObject,item.id_curso,item.ciclo);

            horas_total = await horasTotalCalcular(listaSemanal);

            innerPart.hDescargaTotal = horas_total;
            innerPart.semana = listaSemanal;
            return innerPart;
        }));

        return jsonHorasDescargaDetalle;

    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}

async function hDescCiclo(preferencesObject){
    try {

        let jsonHorasDescargaListar = await horasDescargaListar(preferencesObject);



        let jsonHorasDescargaDetalle = Promise.all(jsonHorasDescargaListar.map(async item => {
            let innerPart = {};
            innerPart.id_curso = item.id_curso;
            innerPart.curso = item.curso;
            innerPart.codigo = item.codigo;
            innerPart.ciclo = item.ciclo;
            innerPart.horario = item.horario;


            let horas_total = 0;
            let listaSemanal = await horasDescargaDetalle(preferencesObject,item.id_curso,item.ciclo);

            horas_total = await horasTotalCalcular(listaSemanal);

            innerPart.hDescargaTotal = horas_total;
            innerPart.semana = listaSemanal;
            return innerPart;
        }));

        return jsonHorasDescargaDetalle;

    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}




async function horasDescarga(preferencesObject) {
    try{
        let c = preferencesObject.ciclo;
        console.log(c);

        if (c == "all"){
            return await hDescAll(preferencesObject);
        }else{
            return await hDescCiclo(preferencesObject);
        }
    } catch (e){
        console.log(e);
        winston.error("listaEncuestas failed");
    }
}


async function insertaHoraDescDocente(preferencesObject){
    console.log("Comienza insertaHoraDescDocente");
    let horas_reducidas;
    let codigo_profesor;
    let codigo_horario;
    let ciclo;
    let codigo_curso;
    let numero_semana;
    let motivo;
    let observaciones;



    if (preferencesObject.horas_reducidas != null) {
        console.log("horas_reducidas NO es nulo");
        horas_reducidas = preferencesObject.horas_reducidas;
    } else {
        console.log("horas_reducidas es nulo");
        horas_reducidas = null;
    }

    if (preferencesObject.codigo_profesor != null) {
        console.log("codigo_profesor NO es nulo");
        codigo_profesor = preferencesObject.codigo_profesor;
    } else {
        console.log("codigo_profesor es nulo");
        codigo_profesor = null;
    }

    if (preferencesObject.codigo_horario != null) {
        console.log("codigo_horario NO es nulo");
        codigo_horario = preferencesObject.codigo_horario;
    } else {
        console.log("codigo_horario es nulo");
        codigo_horario = null;
    }

    if (preferencesObject.ciclo != null) {
        console.log("ciclo NO es nulo");
        ciclo = preferencesObject.ciclo;
    } else {
        console.log("ciclo es nulo");
        ciclo = null;
    }

    if (preferencesObject.codigo_curso != null) {
        console.log("codigo_curso NO es nulo");
        codigo_curso = preferencesObject.codigo_curso;
    } else {
        console.log("codigo_curso es nulo");
        codigo_curso = null;
    }

    if (preferencesObject.numero_semana != null) {
        console.log("numero_semana NO es nulo");
        numero_semana = preferencesObject.numero_semana;
    } else {
        console.log("numero_semana es nulo");
        numero_semana = null;
    }

    if (preferencesObject.motivo != null) {
        console.log("motivo NO es nulo");
        motivo = preferencesObject.motivo;
    } else {
        console.log("motivo es nulo");
        motivo = null;
    }

    if (preferencesObject.observaciones != null) {
        console.log("observaciones NO es nulo");
        observaciones = preferencesObject.observaciones;
    } else {
        console.log("observaciones es nulo");
        observaciones = null;
    }

    try{

    if (horas_reducidas!=null && codigo_profesor!=null && codigo_horario!=null && ciclo!=null && codigo_curso!=null && numero_semana!=null && motivo!=null){
        await sequelize.query('CALL insertaHoraDescDocente(:horas_reducidas,:codigo_profesor,:codigo_horario,:ciclo,:codigo_curso,:numero_semana,:motivo,:observaciones)',
            {

                replacements: {
                    horas_reducidas:horas_reducidas,
                    codigo_profesor:codigo_profesor,
                    codigo_horario:codigo_horario,
                    ciclo:ciclo,
                    codigo_curso:codigo_curso,
                    numero_semana:numero_semana,
                    motivo:motivo,
                    observaciones:observaciones
                }
            }
        );
    }
    }catch (e){
        console.log(e);
        winston.error("registraHoraDescDocente failed");
        return -1;
    }


}


async function registraHoraDescDocente(preferencesObject){
    try {

        let last_id = -1;

        await insertaHoraDescDocente(preferencesObject);


        last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
            {

                replacements: {
                    tabla: "descarga",
                }
            }
        );
        console.log("Convocatoria registrada correctamente");


        return last_id;

    }catch (e){
        console.log(e);
        winston.error("registraHoraDescDocente failed");
        return -1;
    }
}


async function modificaHoraDescDocente(preferencesObject){
    try {
        console.log("Comienza modificaHoraDescDocente");
        let id_descarga;
        let estado;
        let horas_reducidas;
        let numero_semana;
        let motivo;
        let observaciones;

        if (preferencesObject.id_descarga != null) {
            console.log("id_descarga NO es nulo");
            id_descarga = preferencesObject.id_descarga;
        } else {
            console.log("id_descarga es nulo");
            id_descarga = null;
        }

        if (preferencesObject.estado != null) {
            console.log("estado NO es nulo");
            estado = preferencesObject.estado;
        } else {
            console.log("estado es nulo");
            estado = null;
        }

        if (preferencesObject.horas_reducidas != null) {
            console.log("horas_reducidas NO es nulo");
            horas_reducidas = preferencesObject.horas_reducidas;
        } else {
            console.log("horas_reducidas es nulo");
            horas_reducidas = null;
        }


        if (preferencesObject.numero_semana != null) {
            console.log("numero_semana NO es nulo");
            numero_semana = preferencesObject.numero_semana;
        } else {
            console.log("numero_semana es nulo");
            numero_semana = null;
        }

        if (preferencesObject.motivo != null) {
            console.log("motivo NO es nulo");
            motivo = preferencesObject.motivo;
        } else {
            console.log("motivo es nulo");
            motivo = null;
        }

        if (preferencesObject.observaciones != null) {
            console.log("observaciones NO es nulo");
            observaciones = preferencesObject.observaciones;
        } else {
            console.log("observaciones es nulo");
            observaciones = null;
        }


            if (id_descarga != null&&horas_reducidas!=null && numero_semana!=null && estado!=null){
                await sequelize.query('CALL modificaHoraDescDocente(:id_descarga,:estado,:horas_reducidas,:numero_semana,:motivo,:observaciones)',
                    {

                        replacements: {
                            id_descarga:id_descarga,
                            estado:estado,
                            horas_reducidas:horas_reducidas,
                            numero_semana:numero_semana,
                            motivo:motivo,
                            observaciones:observaciones
                        }
                    }
                );
                return "modificaHoraDescDocente exitoso";
            }
        return "modificaHoraDescDocente failed";
    }catch (e){
        console.log(e);
        winston.error("modificaHoraDescDocente failed");
        return "error";
    }
}

async function cambioEstadoHoraDescDocente(preferencesObject){
    try {
        console.log("Comienza cambio estado");
        let id_descarga;
        let estado;



        if (preferencesObject.id_descarga != null) {
            console.log("id_descarga NO es nulo");
            id_descarga = preferencesObject.id_descarga;
        } else {
            console.log("id_descarga es nulo");
            id_descarga = null;
        }

        if (preferencesObject.estado != null) {
            console.log("estado NO es nulo");
            estado = preferencesObject.estado;
        } else {
            console.log("estado es nulo");
            estado = null;
        }

        if (id_descarga != null&&estado!=null){
            await sequelize.query('CALL cambioEstadoHoraDescDocente(:id_descarga,:estado)',
                {

                    replacements: {
                        id_descarga:id_descarga,
                        estado:estado
                    }
                }
            );
            return "cambioEstadoHoraDescDocente exitoso";
        }
        return "cambioEstadoHoraDescDocente failed";
    }catch (e){
        console.log(e);
        winston.error("cambioEstadoHoraDescDocente failed");
        return "error";
    }
}



async function aprobarDescDocente(preferencesObject){
    try {
        console.log("Comienza aprobacion");
        let id_descarga;


        if (preferencesObject.id != null) {
            console.log("id_descarga NO es nulo");
            id_descarga = preferencesObject.id;
        } else {
            console.log("id_descarga es nulo");
            id_descarga = null;
        }


        if (id_descarga != null){
            await sequelize.query('CALL aprobarHoraDescDocente(:id_descarga)',
                {

                    replacements: {
                        id_descarga:id_descarga
                    }
                }
            );
            return "aprobarHoraDescDocente exitoso";
        }
        return "aprobarHoraDescDocente failed";
    }catch (e){
        console.log(e);
        winston.error("aprobarHoraDescDocente failed");
        return "error";
    }
}

async function eliminaHoraDescDocente(preferencesObject){
    try {
        let id_descarga;

        if (preferencesObject.id_descarga != null) {
            console.log("id_descarga NO es nulo");
            id_descarga = preferencesObject.id_descarga;
        } else {
            console.log("id_descarga es nulo");
            id_descarga = null;
        }

        if (id_descarga != null){
            await sequelize.query('CALL eliminaHoraDescDocente(:id_descarga)',
                {

                    replacements: {
                        id_descarga:id_descarga
                    }
                }
            );
            return "eliminaHoraDescDocente exitoso";
        }
        return "eliminaHoraDescDocente failed";
    }catch (e){
        console.log(e);
        winston.error("eliminaHoraDescDocente failed");
        return "error";
    }
}





async function rechazarDescDocente(preferencesObject){
    try {
        let id_descarga,observacion;

        if (preferencesObject.id_descarga != null) {
            console.log("id_descarga NO es nulo");
            id_descarga = preferencesObject.id_descarga;
        } else {
            console.log("id_descarga es nulo");
            id_descarga = null;
        }


        if (preferencesObject.observacion != null) {
            console.log("comentario NO es nulo");
            observacion = preferencesObject.observacion;
        } else {
            console.log("comentario es nulo");
            observacion = null;
        }

        if (id_descarga != null){
            await sequelize.query('CALL rechazarDescDocente(:id_descarga,:observacion)',
                {

                    replacements: {
                        id_descarga:id_descarga,
                        observacion:observacion
                    }
                }
            );
            return "rechazarDescDocente exitoso";
        }
        return "rechazarDescDocente failed";
    }catch (e){
        console.log(e);
        winston.error("rechazarDescDocente failed");
        return "error";
    }
}  
      
      
      


async function CargaHoraria(preferencesObject){

    try{
        let jsonLista = {};
        let response = await sequelize.query(`call devuelveDocente(${preferencesObject.codigo})`);
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
            let datosCiclo =  await sequelize.query(`call devuelveDatosCiclo('${preferencesObject.ciclo}')`);
            let horasPorCurso =
                await sequelize.query(`call devuelveHorasCursoDocente(${response[0].id},${datosCiclo[0].id})`);
            jsonLista.horasRequeridas = horasPorCurso[0].total * 10;
            jsonLista.horasPorCurso = horasPorCurso[0].total * 10;
            let horasDescarga =
                await sequelize.query(`call devuelveHorasDescargaDocente(${response[0].id},${datosCiclo[0].id})`);
            jsonLista.horasDescarga = horasDescarga[0].total*1;
            jsonLista.horasDeuda = (horasPorCurso[0].total * 10)-(horasDescarga[0].total*1);
        }
        return jsonLista;
    }catch (e) {
        return e;

    }
}

module.exports  ={
    horasDescarga:horasDescarga,
    registraHoraDescDocente:registraHoraDescDocente,
    modificaHoraDescDocente:modificaHoraDescDocente,
    eliminaHoraDescDocente:eliminaHoraDescDocente,
    aprobarDescDocente:aprobarDescDocente,
    cambioEstadoHoraDescDocente:cambioEstadoHoraDescDocente,
    rechazarDescDocente:rechazarDescDocente,
    CargaHoraria:CargaHoraria

};


