var express = require('express');
var router = express.Router();
var docenteController = require('../controller/perfilDocente/perfilDocente');
var docenteActividadController = require('../controller/perfilDocente/actividadDocente');

/* GET home page. */
router.get('/', async function(req, res,next) {
    //res.send('welcome to the jungle');
    let jsonBlock = await docenteController.devuelveDocente();
    res.send(jsonBlock);
});

router.get('/actividad',async function (req,res,next){
    let jsonBlock = await docenteActividadController.devuelveActividad();
    res.send(jsonBlock);
    //res.send('Activities go here #####');

});

module.exports = router;
