const express = require('express');
const router = express.Router();

const ayudasEconomicasAsistenteController = require('../controller/ayudasEconomicas/ayudasEconomicasAsistente.js'); //carlos
const ayudasEconomicasJefeController = require('../controller/ayudasEconomicas/ayudasEconomicasJefe.js'); //moises


router.get('/a', async function(req, res) {
    let jsonBlock={};
    jsonBlock.prueba= await ayudasEconomicasJefeController.prueba(req.query);

    res.send(jsonBlock);

});

router.get('/b', async function(req, res) {
    let jsonBlock={};
    jsonBlock.prueba= await ayudasEconomicasAsistenteController.prueba(req.query);

    res.send(jsonBlock);

});

module.exports = router;