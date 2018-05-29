const express = require('express');
const router = express.Router();
const listaController = require('../controller/general/listas');

router.get('/listaDocente', async function (req, res) {
    let queryResult= {};
    queryResult.docentes = await listaController.listaDocente();
    res.send(queryResult) ;
});

router.get('/listaCiclos', async function (req, res) {
    let queryResult= {};
    queryResult.ciclos = await listaController.listaCiclos();
    res.send(queryResult) ;
});

router.get('/listaSecciones', async function (req, res) {
    let queryResult= {};
    queryResult.secciones = await listaController.listaSeccciones();
    res.send(queryResult) ;
});

router.get('/listaMotivosAyudaEc', async function (req, res) {
    let queryResult= {};
    queryResult.motivos = await listaController.listaMotivosAyudaEc();
    res.send(queryResult) ;
});

router.get('/listaEstadosAyudaEc', async function (req, res) {
    let queryResult= {};
    queryResult.estados = await listaController.listaEstadosAyudaEc();
    res.send(queryResult) ;
});

router.get('/cicloActual', async function (req, res) {
    let queryResult= {};
    queryResult.cicloActual = await listaController.cicloActual();
    res.send(queryResult) ;
});
router.get('/listaPais', async function (req, res) {
    let queryResult= {};
    queryResult.pais = await listaController.listaPais();
    res.send(queryResult) ;
});
router.get('/listaCurso', async function (req, res) {
    let queryResult= {};
    queryResult.curso = await listaController.listaCurso();
    res.send(queryResult) ;
});
router.get('/listaTipoDocumento', async function (req, res) {
    let queryResult= {};
    queryResult.tipo_documento = await listaController.listaTipoDocumento();
    res.send(queryResult) ;
});
module.exports = router;
