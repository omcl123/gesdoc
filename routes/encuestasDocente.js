var express = require('express');
var router = express.Router();
var encuestaDocenteListarController = require("../controller/perfilDocente/encuestasDocente");

router.get('/lista', async function(req, res, next) {
    let id_profesor = req.param('id_profesor');
    let jsonBlock = await encuestaDocenteListarController.returnList(id_profesor);
    res.send(jsonBlock);
});

router.get('/detalle', async function(req, res, next) {
    let id_profesor = req.param('id_profesor');
    let id_curso = req.param('id_curso');
    let id_ciclo = req.param('id_ciclo');
    let jsonBlock = await encuestaDocenteListarController.returnDet(id_profesor,id_curso,id_ciclo);
    res.send(jsonBlock);
});

router.get('/comentarios', async function(req, res, next) {
    let id_profesor = req.param('id_profesor');
    let id_curso = req.param('id_curso');
    let id_ciclo = req.param('id_ciclo');
    let jsonBlock = await encuestaDocenteListarController.returnComment(id_profesor,id_curso,id_ciclo);
    res.send(jsonBlock);
});


module.exports = router;
