const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const docenteEncuestaController = require('../controller/perfilDocente/encuestasDocente');
const investigacionController = require ('../controller/perfilDocente/investigacionDocente');
const descargaController = require('../controller/perfilDocente/horasDescargaDocentes');
const ayudaEconController = require('../controller/perfilDocente/ayudaEconomica');

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

router.post('/investigacion/registrar',async function (req,res){ //Aqui ira el registro de investigaciones
    let jsonRes={}
    jsonRes.nuevo_id_investigacion=await investigacionController.registraInvestigacion(req.body);
    res.send(jsonRes);

});

router.put('/investigacion/actualizar',async function (req,res){ //Aqui ira la actualizacion de investigaciones
    let jsonRes={}
    jsonRes.mensaje=await investigacionController.actualizaInvestigacion(req.body);
    res.send(jsonRes);
    //res.send("Aqui ira la actualizacion de investigaciones");

});
router.delete('/investigacion/eliminar',async function (req,res){ //Aqui ira la eliminacion de investigaciones
    //res.send("Aqui ira la eliminacion de investigaciones");
    let jsonRes={}
    console.log(JSON.stringify(req.body));
    jsonRes.mensaje=await investigacionController.eliminarInvestigacion(req.body);
    res.send(jsonRes);
});

router.get('/ayudaEconomica/lista', async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudas = await ayudaEconController.listaAyudas(req.query);

    res.send(jsonBlock);
});

router.post('/actividad/registrar',async function (req,res){
    let jsonRes={}
    jsonRes.nuevo_id_Actividad=await docenteActividadController.registraActividad(req.body);
    res.send(jsonRes);

});

router.put('/actividad/actualizar',async function (req,res){
    let jsonRes={}
    jsonRes.mensaje=await docenteActividadController.actualizaActividad(req.body);
    res.send(jsonRes);


});
router.delete('/actividad/eliminar',async function (req,res){
    let jsonRes={}
    jsonRes.mensaje=await docenteActividadController.eliminaActividad(req.body);
    res.send(jsonRes);
});



module.exports = router;
