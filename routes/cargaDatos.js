const express = require('express');
const router = express.Router();
const cargaController = require("../controller/cargaDatos/cargaPrincipal");
const VerifyToken = require('../auth/VerifyToken');
/* GET home page. */
router.post('/cargaDatos',VerifyToken, async function(req, res) {
    let carga = await cargaController.cargaPrincipal(req.body);
    console.log(req.body);
    res.send(carga);
});

module.exports = router;
