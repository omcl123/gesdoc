const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');

/* GET home page. */
router.get('/', async function(req, res) {
    let jsonBlock = {};

    await docenteController.devuelveDocente(jsonBlock, req.query);
    await docenteActividadController.devuelveActividad(jsonBlock, req.query);
    await docenteCursosController.muestraCursoCiclo(jsonBlock, req.query);

    res.send(jsonBlock);
});

module.exports = router;
