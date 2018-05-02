const express = require('express');
const router = express.Router();
const listaController = require('../controller/general/listas');

router.get('/listaDocente', async function (req, res) {
    let queryResult= {};
    queryResult.docentes = await listaController.listaDocente()
    res.send(queryResult) ;
});

router.get('/listaCiclos', async function (req, res) {
    let queryResult= {};
    queryResult.ciclos = await listaController.listaCiclos()
    res.send(queryResult) ;
});

router.get('/listaSecciones', async function (req, res) {
    let queryResult= {};
    queryResult.secciones = await listaController.listaSeccciones()
    res.send(queryResult) ;
});

router.get('/listaMotivosAyudaEc', async function (req, res) {
    let queryResult= {};
    queryResult.motivos = await listaController.listaMotivosAyudaEc()
    res.send(queryResult) ;
});

router.get('/listaEstadosAyudaEc', async function (req, res) {
    let queryResult= {};
    queryResult.estados = await listaController.listaEstadosAyudaEc()
    res.send(queryResult) ;
});

module.exports = router;
