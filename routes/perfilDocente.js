const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const listaDocenteController = require('../controller/perfilDocente/listaDocentes');

/* GET home page. */
router.get('/docente', async function(req, res) {
    let jsonBlock = {};

    await docenteController.devuelveDocente(jsonBlock, req.query);
    // await investigacionController.devuelveInvestigacion(jsonBlock.investigaciones, req.query);
    await docenteActividadController.devuelveActividad(jsonBlock.actividades, req.query);
    await docenteCursosController.muestraCursoCiclo(jsonBlock.cursos, req.query);
    await docenteController.listaEncuestas(jsonBlock.encuestas, req.query);
    // await descargaController.horasDescarga(jsonBlock.horasDescarga,req.query);
    res.send(jsonBlock);
});

router.get('/listaDocentes',async function (req, res) {
    let jsonBlock;

    jsonBlock = await listaDocenteController.listaDocente();

    return jsonBlock;
})

module.exports = router;
