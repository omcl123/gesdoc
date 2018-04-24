const express = require('express');
const router = express.Router();
const cargaController = require("../controller/cargaDatos/cargaProfesores");

/* GET home page. */
router.post('/cargaProf', async function(req, res) {
    let carga = await cargaController.cargaDocente(req.body);
    res.send(carga);
});

module.exports = router;
