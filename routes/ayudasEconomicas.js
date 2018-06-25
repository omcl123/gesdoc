const express = require('express');
const router = express.Router();
const VerifyToken = require('../auth/VerifyToken');

const ayudasEconomicasAsistenteController = require('../controller/ayudasEconomicas/ayudasEconomicasAsistente.js'); //carlos
const ayudasEconomicasJefeController = require('../controller/ayudasEconomicas/ayudasEconomicasJefe.js'); //moises
const ayudasEconomicasController = require('../controller/ayudasEconomicas/ayudasEconomicas');

const multer = require('multer');

const UPLOAD_PATH = '/home/inf245/files/ayudaEconomica/';
const upload = multer({ dest: `${UPLOAD_PATH}/` });
const type = upload.single('file');


router.get('/ayudasEconomicas/listar',VerifyToken,async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudasEconomicas(req.query,req.body);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/devuelveJustificacion',VerifyToken,async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudaEconomicaJustificacion(req.query);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/filtrar',VerifyToken,async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudasEconomicasFiltro(req.query);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/detallar',VerifyToken,async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveDetalleAyudaEconomica(req.query);
    res.send(jsonBlock);
});

router.put('/ayudasEconomicas/modificar',VerifyToken,async function (req,res){
    let jsonBlock={};
    jsonBlock.mensaje = await ayudasEconomicasJefeController.modificarAyudaEconomica(req.body);
    res.send(jsonBlock);
});
//registrar ayudaEconomica
router.post('/ayudasEconomicas/registrar',VerifyToken, async function (req,res) {
    let jsonBlock;
    jsonBlock = await ayudasEconomicasAsistenteController.registrarAyudaEconomica(req.body);
    res.send(jsonBlock);
});

//registrar gasto
router.post('/ayudasEconomicas/DocumentoGasto/registrar',VerifyToken, async function (req,res) {
    let jsonBlock;
    jsonBlock = await ayudasEconomicasAsistenteController.registrarDocumentoGasto(req.body);
    res.send(jsonBlock);
});

//listar motivo
router.get('/ayudasEconomicas/motivos',VerifyToken,async function (req,res){
    let jsonBlock={};
    jsonBlock.motivos = await ayudasEconomicasController.listarMotivos(req.query);
    res.send(jsonBlock);
});

router.get('/ayudasEconomicas/estado',VerifyToken,async function (req,res){
    await ayudasEconomicasController.estadoAyudaEconomica(req.query,res);
});


//modificar ayuda economica
router.put('/ayudasEconomicasAsistente/modificar',VerifyToken,async function (req,res){
    let jsonRes={};
    jsonRes.mensaje=await ayudasEconomicasAsistenteController.modificarAyudaEconomica(req.body);
    res.send(jsonRes);

});

//eliminar ayuda economica
router.delete('/ayudasEconomicasAsistente/rechazar',VerifyToken,async function (req,res){
    let jsonRes={};
    console.log(JSON.stringify(req.body));
    jsonRes.mensaje=await ayudasEconomicasAsistenteController.rechazaAyudaEconomica(req.body);
    res.send(jsonRes);
});

//eliminar eliminar justificacion
router.delete('/ayudasEconomicasAsistente/DocumentoGasto/eliminar',VerifyToken,async function (req,res){
    let jsonRes={};
    console.log(JSON.stringify(req.body));
    jsonRes.mensaje=await ayudasEconomicasAsistenteController.eliminarDocumentoGasto(req.body);
    res.send(jsonRes);
});

router.post('/ayudasEconomicasAsistente/registrarArchivo',VerifyToken,type,async function (req,res){ //Aqui ira el registro de investigaciones
    let data = req.file;
    let jsonRes = await ayudasEconomicasAsistenteController.registraArchivo(data);
    res.send(jsonRes);

});

router.post('/ayudasEconomicasAsistente/modificarArchivo',VerifyToken,type,async function (req,res){ //Aqui ira el registro de investigaciones
    let data = req.file;
    let id = req.header.id;
    let jsonRes = await ayudasEconomicasAsistenteController.modificarArchivo(data,id);
    res.send(jsonRes);

});

//finalizae gastos en ayuda economica
router.put('/ayudasEconomicas/DocumentoGasto/finalizar',VerifyToken,async function (req,res){
    let jsonRes={}
    jsonRes.monto_devolucion=await ayudasEconomicasAsistenteController.finalizarGastos(req.body);
    res.send(jsonRes);

});

module.exports = router;

