const express = require('express');
const router = express.Router();

const convocatoriaController = require('../controller/convocatoria/convocatoria.js');
const postulanteController = require('../controller/convocatoria/postulante.js');



//Lista convocatorias
router.get('/convocatoria/lista', async function(req, res) {
    let jsonBlock={};
    jsonBlock.convocatorias= await convocatoriaController.listaConvocatoria(req.query);

    res.send(jsonBlock);

});


//Detalle convocatoria
router.get('/convocatoria/detalle', async function(req, res) {
    let jsonBlock={};
    jsonBlock = await convocatoriaController.detalleConvocatoria(req.query);

    res.send(jsonBlock);

});


//Listar Postulante
router.get('/convocatoria/postulante/listar', async function (req,res){
    let jsonBlock ={}
    jsonBlock.postulante=await postulanteController.listarPostulante(req.query);
    res.send(jsonBlock);
});



module.exports = router;
