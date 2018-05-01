const express = require('express');
const router = express.Router();

const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const docenteController = require('../controller/perfilDocente/perfilDocente');
const docenteActividadController = require('../controller/perfilDocente/actividadDocente');
const docenteCursosController = require('../controller/perfilDocente/cursosCiclo');
const docenteEncuestaController = require('../controller/perfilDocente/encuestasDocente');
const listaDocenteController = require('../controller/perfilDocente/listaDocentes');
const descargaController = require('../controller/perfilDocente/horasDescargaDocentes');

/* GET home page. */
router.get('/docente', async function(req, res) {
    let jsonBlock = {};

    //jsonBlock = await docenteController.devuelveDocente(req.query);
    //jsonBlock.investigaciones = await investigacionController.devuelveInvestigacion(req.query);
    //jsonBlock.actividades = await docenteActividadController.devuelveActividad(req.query);
    jsonBlock.cursos = await docenteCursosController.muestraCursoCiclo( req.query);
    jsonBlock.encuestas = await docenteEncuestaController.listaEncuestas(req.query);
    jsonBlock.horasDescarga = await descargaController.horasDescarga(req.query);

    res.send(jsonBlock);
});

router.get('/listaDocente', async function (req, res) {
    let queryResult = await listaDocenteController.listaDocente()
   res.send(queryResult) ;
});


router.post('/registraActividad', async function(req, res) {
    let carga = await docenteActividadController.registraActividad(req.body);
    console.log(req.body);
    res.send(req.body);
});

module.exports = router;
