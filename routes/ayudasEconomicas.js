const express = require('express');
const router = express.Router();


const ayudasEconomicasAsistenteController = require('../controller/ayudasEconomicas/ayudasEconomicasAsistente.js'); //carlos
const ayudasEconomicasJefeController = require('../controller/ayudasEconomicas/ayudasEconomicasJefe.js'); //moises
const ayudasEconomicasController = require('../controller/ayudasEconomicas/ayudasEconomicas');




router.get('/ayudasEconomicas/listar',async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudasEconomicas(req.query);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/devuelveJustificacion',async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudaEconomicaJustificacion(req.query);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/filtrar',async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudasEconomicasFiltro(req.query);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/detallar',async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveDetalleAyudaEconomica(req.query);
    res.send(jsonBlock);
});

router.put('/ayudasEconomicas/modificar',async function (req,res){
    let jsonBlock={};
    jsonBlock.mensaje = await ayudasEconomicasJefeController.modificarAyudaEconomica(req.body);
    res.send(jsonBlock);
});
//registrar ayudaEconomica
router.post('/ayudasEconomicas/registrar', async function (req,res) {
    let jsonBlock = {}
    jsonBlock = await ayudasEconomicasAsistenteController.registrarAyudaEconomica(req.body);
    res.send(jsonBlock);
});

//registrar gasto
router.post('/ayudasEconomicas/DocumentoGasto/registrar', async function (req,res) {
    let jsonBlock = {}
    jsonBlock = await ayudasEconomicasAsistenteController.registrarDocumentoGasto(req.body);
    res.send(jsonBlock);
});



module.exports = router;

