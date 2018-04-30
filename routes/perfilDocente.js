const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const docenteEncuestaController = require('../controller/perfilDocente/encuestasDocente');
const listaDocenteController = require('../controller/perfilDocente/listaDocentes');
const investigacionController = require ('../controller/perfilDocente/investigacionDocente');
const descargaController = require('../controller/perfilDocente/horasDescargaDocentes');


/* GET home page. */
//Muestra el json grande de docente
router.get('/docente/general', async function(req, res) {
    let jsonBlock;
    jsonBlock= await docenteController.devuelveDocente(req.query);

    res.send(jsonBlock);
});

router.get('/docente/invDocente', async function(req, res) {
    let jsonBlock={};
    jsonBlock.investigaciones = await investigacionController.devuelveListaInvestigacion(req.query);

    res.send(jsonBlock);
});

router.get('/docente/actDocente', async function(req, res) {
    let jsonBlock={};
    jsonBlock.actividades = await docenteActividadController.devuelveListaActividad(req.query);

    res.send(jsonBlock);
});

router.get('/docente/curDocente', async function(req, res) {
    let jsonBlock={};
    jsonBlock.cursos = await docenteCursosController.muestraCursoCiclo( req.query);

    res.send(jsonBlock);
});

router.get('/docente/encDocente', async function(req, res) {
    let jsonBlock={};
    jsonBlock.encuestas = await docenteEncuestaController.listaEncuestas(req.query);

    res.send(jsonBlock);
});

router.get('/docente/horaDescDocente', async function(req, res) {
    let jsonBlock={};
    jsonBlock.descargas = await descargaController.horasDescarga(req.query);

    res.send(jsonBlock);
});


//Rutas para el registro/Actualizacion/delete de investigaciones

router.get('/investigacion/registrar',async function (req,res){ //Aqui ira el registro de investigaciones
    // http://localhost:8080/docente/investigacion/registrar?titulo=titulo_random&autor[]=20112728&autor[]=213131&resumen=texto_random&fecha_inicio=20180429
    // titulo=titulo_random&autor[]=20112728&autor[]=213131&resumen=texto_random&fecha_inicio=20180429&archivo=FALTA
    //res.end("Aqui ira el registro de investigaciones );
    res.end(req.query.titulo+ " "+req.query.autor);
    //console.log(req.query.myarray)
    // [ '136129', '137794', '137792' ]
    //codigo=20112728&titulo=holamundo
});

router.get('/investigacion/actualizar',async function (req,res){ //Aqui ira la actualizacion de investigaciones
    res.end("Aqui ira la actualizacion de investigaciones");

});
router.get('/investigacion/eliminar',async function (req,res){ //Aqui ira la eliminacion de investigaciones
    res.end("Aqui ira la eliminacion de investigaciones");

});
router.get('/listaDocente', async function (req, res) {
    let queryResult = await listaDocenteController.listaDocente()
   res.send(queryResult) ;
});

router.get('/listaCiclos', async function (req, res) {
    let queryResult = await listaDocenteController.listaCiclos()
    res.send(queryResult) ;
});

module.exports = router;
