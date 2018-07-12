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

router.post('/nuevoDocente',VerifyToken, async function(req, res) {
    let carga = await cargaController.nuevoDocente(req.body);
    console.log(req.body);
    res.send(carga);
});

router.post('/nuevoCurso',VerifyToken, async function(req, res) {
    let carga = await cargaController.nuevoCurso(req.body);
    console.log(req.body);
    res.send(carga);
});
router.post('/nuevaEncuesta',VerifyToken, async function(req, res) {
    let carga = await cargaController.nuevaEncuesta(req.body);
    console.log(req.body);
    res.send(carga);
});
router.post('/nuevoHorario',VerifyToken, async function(req, res) {
    let carga = await cargaController.nuevoHorario(req.body);
    console.log(req.body);
    //FIX FIX FIX
    res.send(carga);
});
module.exports = router;
