const express = require('express');
const router = express.Router();
const formController = require('../controller/manejoHorarios/formulario');
const preferenciasController = require('../controller/manejoHorarios/consultaPreferencias');
/* GET home page. */
router.get('/listaCursosPreferencia',async function(req, res) {
    let jsonblock;
    jsonblock = await formController.listaCursosFormulario();
    res.send(jsonblock);
});

router.post('/enviarPreferenciaProfesor',async function(req, res) {
    let jsonblock;
    jsonblock = await formController.llenaPreferenciasFormulario(req.body);
    res.send(jsonblock);
});

router.get('/consultaPreferencias', async function(req, res) {
    let jsonblock;
    jsonblock = await preferenciasController.consultaPreferencias(req.query);
    res.send(jsonblock);
});

router.get('/listaCursosDisponible',async function(req, res) {
    let jsonblock;
    jsonblock = await preferenciasController.listaCursoDisponible(req.query);
    res.send(jsonblock);
});

router.get('/horariosCursoDisponible',async function(req, res) {
    let jsonblock;
    jsonblock = await preferenciasController.horariosCursosDisponible(req.query);
    res.send(jsonblock);
});

router.get('/listaDocenteAsignar', function(req, res) {
    res.send('Hello, friend!');
});

router.post('/asignarDocenteHorario', function(req, res) {
    res.send('Hello, friend!');
});

router.get('/listaDocenteCargaAsignada', function(req, res) {
    res.send('Hello, friend!');
});

router.get('/detalleCargaDocenteAsignado', function(req, res) {
    res.send('Hello, friend!');
});

module.exports = router;
