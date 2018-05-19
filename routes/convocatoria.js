const express = require('express');
const router = express.Router();

const convocatoriaController = require('../controller/convocatoria/convocatoria.js');




//Lista convocatorias
router.get('/convocatoria/lista', async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudas = await convocatoriaController.listaConvocatoria(req.query);

    res.send(jsonBlock);

});


//Detalle convocatoria
router.get('/convocatoria/detalle', async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudas = await convocatoriaController.detalleConvocatoria(req.query);

    res.send(jsonBlock);

});






module.exports = router;
