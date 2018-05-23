const express = require('express');
const router = express.Router();

const convocatoriaController = require('../controller/convocatoria/convocatoria.js');
const postulanteController = require('../controller/convocatoria/postulante.js');



//Lista convocatorias
router.get('/convocatoria/lista', async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudas = await convocatoriaController.listaConvocatoria(req.query);

    res.send(jsonBlock);

});


//Detalle convocatoria
router.get('/convocatoria/detalle', async function(req, res) {
    let jsonBlock={};
    jsonBlock.ayudas = await convocatoriaController.detalleConvocatoria(req.query);

    res.send(jsonBlock);

});

//Listar Postulante
router.get('/convocatoria/postulante/listar', async function (req,res){
    let jsonBlock ={}
    jsonBlock.postulante=await postulanteController.listarPostulante(req.query);
    res.send(jsonBlock);
});

//registrar postulante
router.post('/convocatoria/postulante/registrar', async function (req,res){
    let jsonBlock ={}
    jsonBlock.mensaje=await postulanteController.registrarPostulante(req.body);
    res.send(jsonBlock);
});


module.exports = router;
