var express = require('express');
var router = express.Router();
var DocenteEncuestasController = require("../controller/perfilDocente/encuestasDocente");

router.get('/encuestas/', async function(req, res, next) {
    let id_profesor = req.param('id_profesor');
    let jsonBlock = await DocenteEncuestasController.returnList(id_profesor);
    res.send(jsonBlock);
});

/*
router.get('/detalleencuestas', async function(req, res, next) {
    let id_profesor = req.param('id_profesor');
    let id_curso = req.param('id_curso');
    let id_ciclo = req.param('id_ciclo');
    let jsonBlock = await DocenteEncuestasController.returnDet(id_profesor,id_curso,id_ciclo);
    res.send(jsonBlock);
});

router.get('/comentarios', async function(req, res, next) {
    let id_profesor = req.param('id_profesor');
    let id_curso = req.param('id_curso');
    let id_ciclo = req.param('id_ciclo');
    let jsonBlock = await DocenteEncuestasController.returnComment(id_profesor,id_curso,id_ciclo);
    res.send(jsonBlock);
});*/


router.get('/encuestas/det', async function(req, res, next){
    let jsonBlock = {};
    let id_profesor = req.param('id_profesor');
    let id_curso = req.param('id_curso');
    let id_ciclo = req.param('id_ciclo');
    await DocenteEncuestasController.returnDet(jsonBlock,id_profesor,id_curso,id_ciclo);
    await DocenteEncuestasController.returnComment(jsonBlock,id_profesor,id_curso,id_ciclo);
    res.send(jsonBlock);
});

module.exports = router;
