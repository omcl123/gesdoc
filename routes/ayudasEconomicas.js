const express = require('express');
const router = express.Router();


const ayudasEconomicasAsistenteController = require('../controller/ayudasEconomicas/ayudasEconomicasAsistente.js'); //carlos
const ayudasEconomicasJefeController = require('../controller/ayudasEconomicas/ayudasEconomicasJefe.js'); //moises
const ayudasEconomicasController = require('../controller/ayudasEconomicas/ayudasEconomicas');






//Lista ayudasEconomicas
router.get('/ayudasEconomicas/lista', async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudasEconomicas= await ayudasEconomicasController.listaAyudasEconomicas(req.query);


    res.send(jsonBlock);

});


//Detalle ayudasEconomicas
router.get('/ayudasEconomicas/detalle', async function(req, res) {
    let jsonBlock={};
    jsonBlock = await ayudasEconomicasController.detalleAyudasEconomicas(req.query);


    res.send(jsonBlock);

});


router.get('/ayudasEconomicas/listar',async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudasEconomicas(req.query);
    res.send(jsonBlock);
});
router.get('/ayudasEconomicas/filtro',async function (req,res){
    let jsonBlock={};
    jsonBlock.ayudaEconomica = await ayudasEconomicasJefeController.devuelveAyudasEconomicasFiltro(req.query);
    res.send(jsonBlock);
});

//registrar ayudaEconomica
router.post('/ayudasEconomicas/registrar', async function (req,res) {
    let jsonBlock = {}
    jsonBlock = await ayudasEconomicasController.registrarAyudaEconomica(req.body);
    res.send(jsonBlock);
});

//registrar gasto
router.post('/ayudasEconomicas/DocumentoGasto/registrar', async function (req,res) {
    let jsonBlock = {}
    jsonBlock = await ayudasEconomicasController.registrarDocumentoGasto(req.body);
    res.send(jsonBlock);
});



module.exports = router;

