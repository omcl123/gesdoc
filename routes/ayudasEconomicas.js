const express = require('express');
const router = express.Router();

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




module.exports = router;
