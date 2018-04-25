const express = require('express');
const router = express.Router();
const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const docenteEncuestaController = require('../controller/perfilDocente/encuestasDocente');
const listaDocenteController = require('../controller/perfilDocente/listaDocentes');
const investigacionController = require ('../controller/perfilDocente/investigacionDocente');

/* GET home page. */
router.get('/docente', async function(req, res) {
    let jsonBlock = {};
    jsonBlock= await docenteController.devuelveDocente(req.query);
    jsonBlock.investigaciones = await investigacionController.devuelveListaInvestigacion(req.query);

   // jsonBlock.actividades = await docenteActividadController.devuelveActividad(req.query);
   jsonBlock.cursos = await docenteCursosController.muestraCursoCiclo( req.query);
    //jsonBlock.encuestas = await docenteEncuestaController.listaEncuestas(req.query);
    //jsonBlock.horasDescarga = await descargaController.horasDescarga(req.query);

    res.send(jsonBlock);
});

router.get('/listaDocente', async function (req, res) {
    let queryResult = await listaDocenteController.listaDocente()
   res.send(queryResult) ;
});

router.get('/listaCiclos', async function (req, res) {
    let queryResult = await listaDocenteController.listaCiclos()
    res.send(queryResult) ;
});

module.exports = router;
