const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const docenteEncuestaController = require('../controller/perfilDocente/encuestasDocente');
const investigacionController = require ('../controller/perfilDocente/investigacionDocente');
const descargaController = require('../controller/perfilDocente/horasDescargaDocentes');
const ayudaEconController = require('../controller/perfilDocente/ayudaEconomica');
const multer = require('multer');

const UPLOAD_PATH = '/home/inf245/files/investigaciones/';
const upload = multer({ dest: `${UPLOAD_PATH}/` });
const type = upload.single('file');

const UPLOAD_PATH_ACT = '/home/inf245/files/actividades/';
const upload_act = multer({ dest: `${UPLOAD_PATH_ACT}/` });
const type_act = upload_act.single('file');

const VerifyToken = require('../auth/VerifyToken');
/* GET home page. */

//Muestra el json grande de docente
router.get('/docente/general',VerifyToken, async function(req, res) {
    let jsonBlock;
    jsonBlock= await docenteController.devuelveDocente(req.query);
    res.send(jsonBlock);

});

router.post('/cambiaTipoDocente',VerifyToken, async function(req, res) {
    let jsonBlock;
    jsonBlock= await docenteController.cambiaTipoDocente(req.body);
    res.send(jsonBlock);

});

router.get('/docente/invDocente',VerifyToken, async function(req, res) {
    let jsonBlock={};
    jsonBlock.investigaciones = await investigacionController.devuelveListaInvestigacion(req.query);

    res.send(jsonBlock);
});
router.get('/docente/investigacion',VerifyToken, async function(req, res) {
    let jsonBlock;
    jsonBlock = await investigacionController.devuelveInvestigacion(req.query);

    res.send(jsonBlock);
});


router.get('/docente/actDocente',VerifyToken, async function(req, res) {
    let jsonBlock={};
    jsonBlock.actividades = await docenteActividadController.devuelveListaActividad(req.query);

    res.send(jsonBlock);
});

router.get('/docente/curDocente',VerifyToken, async function(req, res) {
    let jsonBlock={};
    jsonBlock.cursos = await docenteCursosController.muestraCursoCiclo( req.query);

    res.send(jsonBlock);
});

router.get('/docente/encDocente',VerifyToken, async function(req, res) {
    let jsonBlock={};
    jsonBlock.encuestas = await docenteEncuestaController.listaEncuestas(req.query);

    res.send(jsonBlock);
});

router.get('/docente/horaDescDocente',VerifyToken, async function(req, res) {
    let jsonBlock={};
    jsonBlock.descargas = await descargaController.horasDescarga(req.query);

    res.send(jsonBlock);
});


//Rutas para el registro/Actualizacion/delete de investigaciones

router.post('/investigacion/registrar',VerifyToken,async function (req,res){ //Aqui ira el registro de investigaciones
    let jsonRes={};
    jsonRes.nuevo_id_investigacion=await investigacionController.registraInvestigacion(req.body);
    res.send(jsonRes);

});

router.post('/investigacion/registrarArchivo',VerifyToken,type,async function (req,res){ //Aqui ira el registro de investigaciones
    let data = req.file;
    let jsonRes = await investigacionController.registraInvestigacionArchivo(data);
    res.send(jsonRes);

});

router.post('/investigacion/modificarArchivo',VerifyToken,type,async function (req,res){ //Aqui ira el registro de investigaciones
    let data = req.file;
    let id = req.header.id;
    let jsonRes = await investigacionController.modificaInvestigacionArchivo(data,id);
    res.send(jsonRes);

});

router.put('/investigacion/actualizar',VerifyToken,async function (req,res){ //Aqui ira la actualizacion de investigaciones
    let jsonRes={};
    jsonRes.mensaje=await investigacionController.actualizaInvestigacion(req.body);
    res.send(jsonRes);
    //res.send("Aqui ira la actualizacion de investigaciones");

});
router.put('/investigacion/actualizar/agregarAutores',VerifyToken,async function (req,res){ //Aqui ira la actualizacion de investigaciones
    let jsonRes={};
    jsonRes.mensaje=await investigacionController.agregaAutores(req.body);
    res.send(jsonRes);
    //res.send("Aqui ira la actualizacion de investigaciones");

});
router.delete('/investigacion/eliminar/eliminarAutores',VerifyToken,async function (req,res){ //Aqui ira la eliminacion de investigaciones
    //res.send("Aqui ira la eliminacion de autores");
    let jsonRes={};
    console.log(JSON.stringify(req.body));
    jsonRes.mensaje=await investigacionController.eliminarAutores(req.body);
    res.send(jsonRes);
});
router.delete('/investigacion/eliminar',VerifyToken,async function (req,res){ //Aqui ira la eliminacion de investigaciones
    //res.send("Aqui ira la eliminacion de investigaciones");
    let jsonRes={};
    console.log(JSON.stringify(req.body));
    jsonRes.mensaje=await investigacionController.eliminarInvestigacion(req.body);
    res.send(jsonRes);
});

router.get('/ayudaEconomica/lista',VerifyToken, async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudas = await ayudaEconController.listaAyudas(req.query);

    res.send(jsonBlock);
});

router.post('/actividad/registrar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.nuevo_id_Actividad=await docenteActividadController.registraActividad(req.body);
    res.send(jsonRes);

});

router.post('/actividad/registrarArchivo',type_act,VerifyToken,async function (req,res){
    let data = req.file;
    let jsonRes = await investigacionController.registraInvestigacionArchivo(data);
    res.send(jsonRes);

});
router.get('/actividad/devuelveArchivos',VerifyToken, async function(req, res) {
    let jsonBlock;
    jsonBlock = await docenteActividadController.devuelveArchivos(req.query);

    res.send(jsonBlock);
});

router.put('/actividad/actualizar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await docenteActividadController.actualizaActividad(req.body);
    res.send(jsonRes);


});
router.delete('/actividad/eliminar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await docenteActividadController.eliminaActividad(req.body);
    res.send(jsonRes);
});

router.get('/actividad/mostrar',async function (req,res){
    let jsonBlock={};
    jsonBlock.actividad=await docenteActividadController.devuelveActividad(req.query);
    res.send(jsonBlock);
});


router.post('/docente/horaDescDocente/registrar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.nuevo_id_horaDescDocente=await descargaController.registraHoraDescDocente(req.body);
    res.send(jsonRes);

});


router.put('/docente/horaDescDocente/modificar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await descargaController.modificaHoraDescDocente(req.body);
    res.send(jsonRes);

});


router.put('/docente/horaDescDocente/cambiaEstado',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await descargaController.cambioEstadoHoraDescDocente(req.body);
    res.send(jsonRes);

});

router.put('/docente/horaDescDocente/aceptar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await descargaController.aprobarDescDocente(req.query);
    res.send(jsonRes);

});

router.delete('/docente/horaDescDocente/eliminar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await descargaController.eliminaHoraDescDocente(req.body);
    res.send(jsonRes);

});

router.get('/CargaHoraria',VerifyToken, async function(req, res) {
    let jsonBlock;
    jsonBlock = await descargaController.CargaHoraria(req.query);

    res.send(jsonBlock);
});

module.exports = router;
