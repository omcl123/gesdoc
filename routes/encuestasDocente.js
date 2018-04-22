var express = require('express');
var router = express.Router();
var encuestaDocenteListarController = require("../controller/perfilDocente/encuestasDocente");

router.get('/', async function(req, res, next) {
    let jsonBlock = await encuestaDocenteListarController.returnList();
    res.send(jsonBlock);
});

router.get('/detalle', async function(req, res, next) {
    var id_curso = req.param('id_curso');
    let jsonBlock = await encuestaDocenteListarController.returnDet(id_curso);
    res.send(jsonBlock);
});

router.get('/comentarios', async function(req, res, next) {
    var id_curso = req.param('id_curso');
    let jsonBlock = await encuestaDocenteListarController.returnComment(id_curso);
    res.send(jsonBlock);
});

router.get('/TestSelect01', async function(req, res, next){
    let jsonBlock = await encuestaDocenteListarController.testSelect();
    res.send(jsonBlock);
});

module.exports = router;
