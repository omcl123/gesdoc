const express = require('express');
const router = express.Router();
const formController = require('../controller/manejoHorarios/formulario');
const preferenciasController = require('../controller/manejoHorarios/consultaPreferencias');
const asignaDocenteController = require('../controller/manejoHorarios/asignacionDocente');
const consultaCargaController = require('../controller/manejoHorarios/consultaCarga');
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

router.get('/listaDocenteAsignar',async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.listaDocenteAsignar(req.query);
    res.send(jsonblock);
});

router.post('/asignarDocenteHorario', async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.asignaDocenteHorario(req.body);
    res.send(jsonblock);
});

router.post('/actualizaDocenteHorario', async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.actualizaDocenteHorario(req.body);
    res.send(jsonblock);
});

router.post('/eliminaDocenteHorario', async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.eliminaDocenteHorario(req.body);
    res.send(jsonblock);
});

router.get('/listaDocenteCargaAsignada',async function(req, res) {
    let jsonblock;
    jsonblock = await consultaCargaController.listaDocenteCargaAsignada(req.query);
    res.send(jsonblock);
});

router.get('/detalleCargaDocenteAsignado',async function(req, res) {
    let jsonblock;
    jsonblock = await consultaCargaController.detalleCargaDocenteAsignado(req.query);
    res.send(jsonblock);
});

module.exports = router;
