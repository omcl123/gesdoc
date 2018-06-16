const express = require('express');
const router = express.Router();
const formController = require('../controller/manejoHorarios/formulario');
const preferenciasController = require('../controller/manejoHorarios/consultaPreferencias');
const asignaDocenteController = require('../controller/manejoHorarios/asignacionDocente');
const consultaCargaController = require('../controller/manejoHorarios/consultaCarga');
const VerifyToken = require('../auth/VerifyToken');
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

router.get('/verificaCodigoDocente',async function(req, res) {
    let jsonblock;
    jsonblock = await formController.verificaCodigoDocente(req.query,res);
});


router.get('/consultaPreferencias',VerifyToken, async function(req, res) {
    let jsonblock;
    jsonblock = await preferenciasController.consultaPreferencias(req.query);
    res.send(jsonblock);
});

router.get('/listaCursosDisponible',VerifyToken,async function(req, res) {
    let jsonblock;
    jsonblock = await preferenciasController.listaCursoDisponible(req.query);
    res.send(jsonblock);
});

router.get('/horariosCursoDisponible',VerifyToken,async function(req, res) {
    let jsonblock;
    jsonblock = await preferenciasController.horariosCursosDisponible(req.query);
    res.send(jsonblock);
});

router.get('/listaDocenteAsignar',VerifyToken,async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.listaDocenteAsignar(req.query);
    res.send(jsonblock);
});

router.post('/asignarDocenteHorario',VerifyToken, async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.asignaDocenteHorario(req.body);
    res.send(jsonblock);
});

router.post('/actualizaDocenteHorario',VerifyToken, async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.actualizaDocenteHorario(req.body);
    res.send(jsonblock);
});

router.post('/eliminaDocenteHorario',VerifyToken, async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.eliminaDocenteHorario(req.body);
    res.send(jsonblock);
});

router.post('/insertaNuevoHorarioCurso',VerifyToken, async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.insertaNuevoHorarioCurso(req.body,res);

});

router.post('/eliminaHorarioCurso',VerifyToken, async function(req, res) {
    let jsonblock;
    jsonblock = await asignaDocenteController.eliminaHorarioCurso(req.body,res);
    res.send(jsonblock);
});

router.get('/listaDocenteCargaAsignada',VerifyToken,async function(req, res) {
    let jsonblock;
    jsonblock = await consultaCargaController.listaDocenteCargaAsignada(req.query);
    res.send(jsonblock);
});

router.get('/detalleCargaDocenteAsignado',VerifyToken,async function(req, res) {
    let jsonblock;
    jsonblock = await consultaCargaController.detalleCargaDocenteAsignado(req.query);
    res.send(jsonblock);
});



module.exports = router;
