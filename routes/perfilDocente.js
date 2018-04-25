const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const docenteEncuestaController = require('../controller/perfilDocente/encuestasDocente');

/* GET home page. */
router.get('/', async function(req, res) {
    let jsonBlock = {};

    await docenteController.devuelveDocente(jsonBlock, req.query);
    // await investigacionController.devuelveInvestigacion(jsonBlock.investigaciones, req.query);
    await docenteActividadController.devuelveActividad(jsonBlock.actividades, req.query);
    await docenteCursosController.muestraCursoCiclo(jsonBlock.cursos, req.query);
    await docenteEncuestaController.listaEncuestas(jsonBlock.encuestas, req.query);
    // await descargaController.horasDescarga(jsonBlock.horasDescarga,req.query);



    res.send(jsonBlock);
});

module.exports = router;
