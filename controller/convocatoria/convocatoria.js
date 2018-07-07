var winston = require('../../config/winston');
const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect()

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

const postulante_controller  = require('./postulante');


const grado_academico_titulo_profesional = "Titulo Profesional";
const grado_academico_maestria = "Maestria";
const grado_academico_doctorado = "Doctorado";
const grado_academico_diplomatura = "Diplomatura";
const docencia_curso = "Cargos a su curso";
const docencia_asesoria = "Asesoria de Tesis";
const docencia_premios = "Premios a la Docencia";
const experiencia_profesional = "Solicitar Experiencia Profesional";
const investigacion = "Solicitar Investigacion";

async function listaConvocatoria(preferencesObject,bodyObject){
    // codigo(id), clave_curso, nombre_convocatoria, fecha creacion, estado
    try {
        let user = await bodyObject.verifiedUser;



        console.log(user);

        let convocatorias = await sequelize.query(`call listaConvocatoria(:tipo_query,:id_unidad)`,
            {
                replacements: {

                    tipo_query:user.tipo_query,
                    id_unidad:user.unidad

                }
            });





        let jsonConvocatorias= await Promise.all(convocatorias.map(async item => {
            let innerPart={};
            innerPart.id = item.id;
            innerPart.codigo=item.codigo;
            innerPart.nombre = item.nombre;
            innerPart.estado=item.estado;
            innerPart.fecha_inicio=item.fecha_inicio;
            innerPart.fecha_registro=item.fecha_registro;
            innerPart.fecha_fin=item.fecha_fin;
            innerPart.cantidadPostulantes = item.cantidadPostulantes;
            innerPart.nombre_seccion = item.nombre_seccion;

/*
            //curso y seccion
            try {
                let detalle_curso = await sequelize.query('CALL detalleCurso(:codigo_curso)',
                    {
                        replacements: {
                            codigo_curso: item.codigo_curso
                        }
                    }
                );

                let j_curso = await Promise.all(detalle_curso.map(async itemCurso => {
                    let innerCurso={};
                    innerCurso.id = itemCurso.id;
                    innerCurso.nombre = itemCurso.nombre;
                    innerCurso.codigo = itemCurso.codigo;
                    return innerCurso;
                }));

                let j_seccion = await Promise.all(detalle_curso.map(async itemSeccion => {
                    let innerSeccion={};
                    innerSeccion.id = itemSeccion.id_seccion;
                    innerSeccion.nombre = itemSeccion.nombre_seccion;
                    return innerSeccion;
                }));

                let cant_cursos = await (cantidad_elementos(j_curso));
                let cant_secc = await (cantidad_elementos(j_seccion));

                if (cant_cursos > 0)
                    innerPart.curso = j_curso[0];
                if (cant_secc > 0)
                    innerPart.seccion = j_seccion[0];





            }catch(e){
                console.log(e);
                winston.error("detalle_curso failed");
            }*/



            return innerPart;
        }));

        console.log(jsonConvocatorias);
        winston.info("listaConvocatoria succesful");
        return jsonConvocatorias;


    }catch(e){
        console.log(e);
        winston.error("listaConvocatoria failed");
    }
}



async function detalleConvocatoria(preferencesObject){
    // nombre_convocatoria, cantidad de postulantes, cantidad de postulantes aceptados, lista de postulantes
    try {

        let convocatoria = await sequelize.query('CALL detalleConvocatoria(:in_convocatoria)',
            {
                replacements: {
                    in_convocatoria: preferencesObject.id

                }
            }
        );

        console.log (convocatoria);

        //listado de postulantes
        let list_postulantes = await postulante_controller.listarPostulante(preferencesObject);

        console.log ("Respuesta del import");
        console.log (list_postulantes);

        let jsondetalleConvocatoria= await Promise.all(convocatoria.map(async item => {
            let innerPart={};
            innerPart.codigo=item.codigo;
            innerPart.nombre=item.nombre;
            innerPart.fecha_limite=item.fecha_limite;
            innerPart.cantidad_postulantes=item.cantidad_postulantes;
            innerPart.cantidad_postulantes_aceptados=item.cantidad_postulantes_aceptados;

            innerPart.postulantes = await Promise.all(list_postulantes.map(async item2 => {
                let innerPart2={};
                innerPart2.codigo = item2.id;
                innerPart2.nombre = item2.nombres + ' ' +item2.apellido_paterno + ' ' + item2.apellido_materno;
                innerPart2.fecha_postulacion = item2.fecha_nacimiento;
                innerPart2.estado_postulacion = item2.estado_postulante;
                //innerPart2.estado_documentos = falta
                return innerPart2;
            }));

            return innerPart;
        }));


        return jsondetalleConvocatoria;

    }catch(e){
        console.log(e);
        winston.error("detalleConvocatoria failed");
    }
}


async function cantidad_elementos(data){
    let key, count = 0;
    for(key in data) {
        if(data.hasOwnProperty(key)) {
            count++;
        }
    }
    return count;
}

async function tiene_elemento(data,elemento){
    let key, peso = -1;
    for(key in data) {
        //console.log("data -> " , data[key]);
        if(data[key].descripcion == elemento)
            return data[key].peso;
    }
    return peso;
}


function convertirFecha(date){
    //20180429

    let year = Math.trunc(date / 10000);
    let month = Math.trunc((date - (10000 * year)) / 100);
    let day = date - (10000 * year) - (100 * month);
    let d = new Date(year + "-" + month + "-" + day);

    return (d);
}


async function insertaConvocatoria(preferencesObject){
    console.log("Comienza insert");
    let fecha_i ;
    let fecha_f;
    let nombre;
    let seccion;
    let requiere_investigacion = 0;
    let requiere_experiencia = 0;
    let requiere_docencia_cargo = 0;
    let requiere_docencia_asesoria = 0;
    let requiere_docencia_premio = 0;
    let requiere_grado_titulo = 0;
    let requiere_grado_maestria = 0;
    let requiere_grado_doctorado = 0;
    let requiere_grado_diplomatura = 0;
    let peso_grado_academico_titulo_profesional = -1;
    let peso_grado_academico_maestria = -1;
    let peso_grado_academico_doctorado = -1;
    let peso_grado_academico_diplomatura = -1;
    let peso_docencia_curso = -1;
    let peso_docencia_asesoria = -1;
    let peso_docencia_premios = -1;
    let peso_experiencia_profesional = -1;
    let peso_investigacion = -1;

    if (preferencesObject.fecha_inicio!=null) {
        console.log("Fecha inicio NO es nulo");
        fecha_i = convertirFecha(preferencesObject.fecha_inicio);
    }else{
        console.log("Fecha inicio es nulo");
        winston.info("Fecha inicio no puede ser nulo");
        fecha_i=null;
        return -1;
    }


    if (preferencesObject.fecha_fin != null) {
        console.log("Fecha fin NO es nulo");
        fecha_f = convertirFecha(preferencesObject.fecha_fin);
    } else {
        console.log("Fecha fin es nulo");
        fecha_f = null;
    }


    if (preferencesObject.nombre != null) {
        console.log("nombre NO es nulo");
        nombre = preferencesObject.nombre;
    } else {
        console.log("nombre es nulo");
        nombre = null;
    }


    if (preferencesObject.seccion != null) {
        console.log("seccion NO es nulo");
        seccion = preferencesObject.seccion;
    } else {
        console.log("seccion es nulo");
        seccion = null;
    }


    if (preferencesObject.grados_academicos != null) {
        console.log("grados_academicos NO es nulo");
        let cant_grados_academicos = await cantidad_elementos(preferencesObject.grados_academicos);
        console.log("cant -> ",cant_grados_academicos);
        if (cant_grados_academicos > 0) {
            peso_grado_academico_titulo_profesional = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_titulo_profesional);
            peso_grado_academico_maestria = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_maestria);
            peso_grado_academico_doctorado = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_doctorado);
            peso_grado_academico_diplomatura = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_diplomatura);

            console.log("peso_grado_academico_titulo_profesional ->" ,peso_grado_academico_titulo_profesional);
            console.log("peso_grado_academico_maestria ->" ,peso_grado_academico_maestria);
            console.log("peso_grado_academico_doctorado ->" ,peso_grado_academico_doctorado);
            console.log("peso_grado_academico_diplomatura ->" ,peso_grado_academico_diplomatura);

            if (peso_grado_academico_titulo_profesional > 0) requiere_grado_titulo = 1;
            if (peso_grado_academico_maestria > 0) requiere_grado_maestria = 1;
            if (peso_grado_academico_doctorado > 0) requiere_grado_doctorado = 1;
            if (peso_grado_academico_diplomatura > 0) requiere_grado_diplomatura = 1;
        }
    }else  {
        console.log("grados_academicos es nulo");
    }

    if (preferencesObject.docencia != null) {
        console.log("docencia NO es nulo");
        let cant_docencia = await cantidad_elementos(preferencesObject.docencia);
        console.log("cant -> ",cant_docencia);
        if (cant_docencia > 0) {
            peso_docencia_curso = await tiene_elemento(preferencesObject.docencia,docencia_curso);
            peso_docencia_asesoria = await tiene_elemento(preferencesObject.docencia,docencia_asesoria);
            peso_docencia_premios = await tiene_elemento(preferencesObject.docencia,docencia_premios);

            console.log("peso_docencia_curso ->" ,peso_docencia_curso);
            console.log("peso_docencia_asesoria ->" ,peso_docencia_asesoria);
            console.log("peso_docencia_premios ->" ,peso_docencia_premios);

            if (peso_docencia_curso > 0) requiere_docencia_cargo = 1;
            if (peso_docencia_asesoria > 0) requiere_docencia_asesoria = 1;
            if (peso_docencia_premios > 0) requiere_docencia_premio = 1;
        }
    }else  {
        console.log("docencia es nulo");
    }

    if (preferencesObject.experiencia_profesional != null) {
        console.log("experiencia_profesional NO es nulo");
        let cant_experiencia_profesional = await cantidad_elementos(preferencesObject.experiencia_profesional);
        console.log("cant -> ",cant_experiencia_profesional);
        if (cant_experiencia_profesional > 0) {
            peso_experiencia_profesional = await tiene_elemento(preferencesObject.experiencia_profesional,experiencia_profesional);
            console.log("peso_experiencia_profesional ->" ,peso_experiencia_profesional);

            if (peso_experiencia_profesional > 0) requiere_experiencia = 1;
        }
    }else  {
        console.log("experiencia_profesional es nulo");
    }

    if (preferencesObject.investigacion != null) {
        console.log("investigacion NO es nulo");
        let cant_investigacion = await cantidad_elementos(preferencesObject.investigacion);
        console.log("cant -> ",cant_investigacion);
        if (cant_investigacion > 0) {
            peso_investigacion = await tiene_elemento(preferencesObject.investigacion,investigacion);
            console.log("peso_investigacion ->" ,peso_investigacion);

            if (peso_investigacion > 0) requiere_investigacion = 1;
        }
    }else  {
        console.log("investigacion es nulo");
    }

    await sequelize.query('CALL insertaConvocatoria(:nombre,:seccion,:fecha_inicio,:fecha_fin,:requiere_investigacion,:requiere_experiencia,:requiere_docencia_cargo,:requiere_docencia_asesoria,:requiere_docencia_premio,:requiere_grado_titulo,:requiere_grado_maestria,:requiere_grado_doctorado,:requiere_grado_diplomatura,:peso_investigacion,:peso_experiencia,:peso_docencia_cargo,:peso_docencia_asesoria,:peso_docencia_premio,:peso_grado_titulo,:peso_grado_maestria,:peso_grado_doctorado,:peso_grado_diplomatura,:descripcion)',
        {

            replacements: {
                nombre: nombre,
                seccion:seccion,
                fecha_inicio: fecha_i,
                fecha_fin: fecha_f,
                requiere_investigacion: requiere_investigacion,
                requiere_experiencia: requiere_experiencia,
                requiere_docencia_cargo: requiere_docencia_cargo,
                requiere_docencia_asesoria: requiere_docencia_asesoria,
                requiere_docencia_premio: requiere_docencia_premio,
                requiere_grado_titulo: requiere_grado_titulo,
                requiere_grado_maestria: requiere_grado_maestria,
                requiere_grado_doctorado: requiere_grado_doctorado,
                requiere_grado_diplomatura: requiere_grado_diplomatura,
                peso_investigacion: peso_investigacion,
                peso_experiencia: peso_experiencia_profesional,
                peso_docencia_cargo: peso_docencia_curso,
                peso_docencia_asesoria: peso_docencia_asesoria,
                peso_docencia_premio: peso_docencia_premios,
                peso_grado_titulo: peso_grado_academico_titulo_profesional,
                peso_grado_maestria: peso_grado_academico_maestria,
                peso_grado_doctorado: peso_grado_academico_doctorado,
                peso_grado_diplomatura: peso_grado_academico_diplomatura,
                descripcion:preferencesObject.descripcion

            }
        }
    );
}


async function verifica_curso(codigo_curso){

    let existe = await sequelize.query('CALL verifica_curso_repetido(:codigoC)',
        {

            replacements: {

                codigoC: codigo_curso
            }
        }
    );

    if (!existe) return -1;
    return existe;
}


async function registraConvocatoria(preferencesObject){

    try{
        let last_id = -1;


            await insertaConvocatoria(preferencesObject);


            last_id = await  sequelize.query('CALL devuelveSiguienteId(:tabla )',
                {

                    replacements: {
                        tabla: "convocatoria",
                    }
                }
            );
            console.log("Convocatoria registrada correctamente");


        return last_id;
    }catch(e){
        console.log(e);
        winston.error("registraConvocatoria failed");
        return -1;
    }
}

async function devuelveConvocatoria(preferencesObject){
    try {
        let convo = await sequelize.query('CALL devuelveConvocatoria(:id)',
            {
                replacements: {
                    id: preferencesObject.id
                }
            }
        );

        return convo;

    }catch(e){
        console.log(e);
        winston.error("devuelveConvocatoria failed");
    return -1;
    }
}



async function modificaConvocatoria(preferencesObject){
    console.log("Comienza update");
    let tipo;
    let id;
    let fecha_i ;
    let fecha_f;
    let estado_convocatoria;
    let nombre;
    let seccion;
    let descripcion;
    let requiere_investigacion = 0;
    let requiere_experiencia = 0;
    let requiere_docencia_cargo = 0;
    let requiere_docencia_asesoria = 0;
    let requiere_docencia_premio = 0;
    let requiere_grado_titulo = 0;
    let requiere_grado_maestria = 0;
    let requiere_grado_doctorado = 0;
    let requiere_grado_diplomatura = 0;
    let peso_grado_academico_titulo_profesional = -1;
    let peso_grado_academico_maestria = -1;
    let peso_grado_academico_doctorado = -1;
    let peso_grado_academico_diplomatura = -1;
    let peso_docencia_curso = -1;
    let peso_docencia_asesoria = -1;
    let peso_docencia_premios = -1;
    let peso_experiencia_profesional = -1;
    let peso_investigacion = -1;

    let tiene_estado = 1;
    let tiene_req1 = 1;
    let tiene_req2 = 1;
    let tiene_req3 = 1;
    let tiene_req = 1;
    let tiene_basic = 0;

    if (preferencesObject.fecha_inicio!=null) {
        console.log("Fecha inicio NO es nulo");
        fecha_i = convertirFecha(preferencesObject.fecha_inicio);
        tiene_basic = 1;
    }else{
        console.log("Fecha inicio es nulo");
        winston.info("Fecha inicio no puede ser nulo");
        fecha_i=null;
    }


    if (preferencesObject.fecha_fin != null) {
        console.log("Fecha fin NO es nulo");
        fecha_f = convertirFecha(preferencesObject.fecha_fin);
        tiene_basic = 1;
    } else {
        console.log("Fecha fin es nulo");
        fecha_f = null;
    }

    if (preferencesObject.id != null) {
        console.log("id NO es nulo");
        id = preferencesObject.id;
    } else {
        console.log("id es nulo");
        id = null;
    }

    if (preferencesObject.tipo != null) {
        console.log("tipo NO es nulo");
        tipo = preferencesObject.tipo;
    } else {
        console.log("tipo es nulo");
        tipo = null;
    }

    if (preferencesObject.nombre != null) {
        console.log("nombre NO es nulo");
        nombre = preferencesObject.nombre;
        tiene_basic = 1;
    } else {
        console.log("nombre es nulo");
        nombre = null;
    }

    if (preferencesObject.estado_convocatoria != null) {
        console.log("estado_convocatoria NO es nulo");
        estado_convocatoria = preferencesObject.estado_convocatoria;
        tiene_estado = 1;
    } else {
        console.log("estado_convocatoria es nulo");
        estado_convocatoria = "Creada";
        tiene_estado = 0;
    }

    if (preferencesObject.seccion != null) {
        console.log("seccion NO es nulo");
        seccion = preferencesObject.seccion;
        tiene_basic = 1;
    } else {
        console.log("seccion es nulo");
        seccion = null;
    }

    if (preferencesObject.descripcion != null) {
        console.log("descripcion NO es nulo");
        descripcion = preferencesObject.descripcion;
        tiene_basic = 1;
    } else {
        console.log("descripcion es nulo");
        descripcion = null;
    }

    if (preferencesObject.grados_academicos != null) {
        console.log("grados_academicos NO es nulo");
        let cant_grados_academicos = await cantidad_elementos(preferencesObject.grados_academicos);
        console.log("cant -> ",cant_grados_academicos);
        if (cant_grados_academicos > 0) {
            peso_grado_academico_titulo_profesional = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_titulo_profesional);
            peso_grado_academico_maestria = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_maestria);
            peso_grado_academico_doctorado = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_doctorado);
            peso_grado_academico_diplomatura = await tiene_elemento(preferencesObject.grados_academicos,grado_academico_diplomatura);

            console.log("peso_grado_academico_titulo_profesional ->" ,peso_grado_academico_titulo_profesional);
            console.log("peso_grado_academico_maestria ->" ,peso_grado_academico_maestria);
            console.log("peso_grado_academico_doctorado ->" ,peso_grado_academico_doctorado);
            console.log("peso_grado_academico_diplomatura ->" ,peso_grado_academico_diplomatura);

            if (peso_grado_academico_titulo_profesional > 0) requiere_grado_titulo = 1;
            if (peso_grado_academico_maestria > 0) requiere_grado_maestria = 1;
            if (peso_grado_academico_doctorado > 0) requiere_grado_doctorado = 1;
            if (peso_grado_academico_diplomatura > 0) requiere_grado_diplomatura = 1;
        }
    }else  {
        console.log("grados_academicos es nulo");
        tiene_req = 0;
    }

    if (preferencesObject.docencia != null) {
        console.log("docencia NO es nulo");
        let cant_docencia = await cantidad_elementos(preferencesObject.docencia);
        console.log("cant -> ",cant_docencia);
        if (cant_docencia > 0) {
            peso_docencia_curso = await tiene_elemento(preferencesObject.docencia,docencia_curso);
            peso_docencia_asesoria = await tiene_elemento(preferencesObject.docencia,docencia_asesoria);
            peso_docencia_premios = await tiene_elemento(preferencesObject.docencia,docencia_premios);

            console.log("peso_docencia_curso ->" ,peso_docencia_curso);
            console.log("peso_docencia_asesoria ->" ,peso_docencia_asesoria);
            console.log("peso_docencia_premios ->" ,peso_docencia_premios);

            if (peso_docencia_curso > 0) requiere_docencia_cargo = 1;
            if (peso_docencia_asesoria > 0) requiere_docencia_asesoria = 1;
            if (peso_docencia_premios > 0) requiere_docencia_premio = 1;
        }
    }else  {
        console.log("docencia es nulo");
        tiene_req1 = 0;
    }

    if (preferencesObject.experiencia_profesional != null) {
        console.log("experiencia_profesional NO es nulo");
        let cant_experiencia_profesional = await cantidad_elementos(preferencesObject.experiencia_profesional);
        console.log("cant -> ",cant_experiencia_profesional);
        if (cant_experiencia_profesional > 0) {
            peso_experiencia_profesional = await tiene_elemento(preferencesObject.experiencia_profesional,experiencia_profesional);
            console.log("peso_experiencia_profesional ->" ,peso_experiencia_profesional);

            if (peso_experiencia_profesional > 0) requiere_experiencia = 1;
        }
    }else  {
        console.log("experiencia_profesional es nulo");
        tiene_req2 = 0;
    }

    if (preferencesObject.investigacion != null) {
        console.log("investigacion NO es nulo");
        let cant_investigacion = await cantidad_elementos(preferencesObject.investigacion);
        console.log("cant -> ",cant_investigacion);
        if (cant_investigacion > 0) {
            peso_investigacion = await tiene_elemento(preferencesObject.investigacion,investigacion);
            console.log("peso_investigacion ->" ,peso_investigacion);

            if (peso_investigacion > 0) requiere_investigacion = 1;
        }
    }else  {
        console.log("investigacion es nulo");
        tiene_req3 = 0;
    }


   tipo = 1;

    if (tiene_req1 == 1 || tiene_req2 == 1 || tiene_req3 ==1)
        tiene_req = 1;

    if (tiene_req1 == 0 && tiene_req2 == 0 && tiene_req3 ==0)
        tiene_req = 0;

    console.log(tiene_estado);
    console.log(tiene_req);
    console.log(tiene_basic);

    if (tiene_estado == 1 && tiene_req == 1 && tiene_basic ==1)
        tipo = 1;
    else if (tiene_estado == 1 && tiene_req==1 && tiene_basic == 0)
        tipo = 4;
    else if (tiene_estado == 1 && tiene_req==0 && tiene_basic == 0)
        tipo = 5;
    else if (tiene_estado == 0 && tiene_req==0 && tiene_basic == 1)
        tipo = 2;
    else if (tiene_estado == 0 && tiene_req==1 && tiene_basic == 0)
        tipo = 3;


    try{

        await sequelize.query('CALL modificaConvocatoria(:tipo,:id,:nombre,:seccion,:descipcion,:fecha_inicio,:fecha_fin,:estado_convocatoria,:requiere_investigacion,:requiere_experiencia,:requiere_docencia_cargo,:requiere_docencia_asesoria,:requiere_docencia_premio,:requiere_grado_titulo,:requiere_grado_maestria,:requiere_grado_doctorado,:requiere_grado_diplomatura,:peso_investigacion,:peso_experiencia,:peso_docencia_cargo,:peso_docencia_asesoria,:peso_docencia_premio,:peso_grado_titulo,:peso_grado_maestria,:peso_grado_doctorado,:peso_grado_diplomatura)',
            {

                replacements: {
                    tipo: tipo,
                    id: id,
                    nombre: nombre,
                    seccion:seccion,
                    descipcion: descripcion,
                    fecha_inicio: fecha_i,
                    fecha_fin: fecha_f,
                    estado_convocatoria: estado_convocatoria,
                    requiere_investigacion: requiere_investigacion,
                    requiere_experiencia: requiere_experiencia,
                    requiere_docencia_cargo: requiere_docencia_cargo,
                    requiere_docencia_asesoria: requiere_docencia_asesoria,
                    requiere_docencia_premio: requiere_docencia_premio,
                    requiere_grado_titulo: requiere_grado_titulo,
                    requiere_grado_maestria: requiere_grado_maestria,
                    requiere_grado_doctorado: requiere_grado_doctorado,
                    requiere_grado_diplomatura: requiere_grado_diplomatura,
                    peso_investigacion: peso_investigacion,
                    peso_experiencia: peso_experiencia_profesional,
                    peso_docencia_cargo: peso_docencia_curso,
                    peso_docencia_asesoria: peso_docencia_asesoria,
                    peso_docencia_premio: peso_docencia_premios,
                    peso_grado_titulo: peso_grado_academico_titulo_profesional,
                    peso_grado_maestria: peso_grado_academico_maestria,
                    peso_grado_doctorado: peso_grado_academico_doctorado,
                    peso_grado_diplomatura: peso_grado_academico_diplomatura

                }
            }
        );
    }catch(e){
    console.log(e);
    winston.error("Modificacion fallida");
    return "Modificacion fallida";
}

    return "Modificacion exitosa";
}

module.exports  ={
    detalleConvocatoria:detalleConvocatoria,
    listaConvocatoria:listaConvocatoria,
    registraConvocatoria:registraConvocatoria,
    devuelveConvocatoria:devuelveConvocatoria,
    modificaConvocatoria:modificaConvocatoria
}
