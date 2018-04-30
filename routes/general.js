const express = require('express');
const router = express.Router();
const listaController = require('../controller/general/listas');

router.get('/listaDocente', async function (req, res) {
    let queryResult = await listaController.listaDocente()
    res.send(queryResult) ;
});

router.get('/listaCiclos', async function (req, res) {
    let queryResult = await listaController.listaCiclos()
    res.send(queryResult) ;
});

module.exports = router;
