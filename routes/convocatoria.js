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
//devuelve POstulante
router.get('/convocatoria/postulante/devolver', async function (req,res){
    let jsonBlock ={}
    jsonBlock=await postulanteController.devuelvePostulante(req.query);
    res.send(jsonBlock);
});

//registrar postulante
router.post('/convocatoria/postulante/registrar', async function (req,res) {
    let jsonBlock = {}
    jsonBlock.mensaje = await postulanteController.registrarPostulante(req.body);
    res.send(jsonBlock);
});

//modificar Postulante
router.put('/convocatoria/postulante/modificar',async function (req,res){ //Aqui ira el registro de convocatorias
    let jsonRes={}
    jsonRes.nuevo_id_convocatoria=await postulanteController.modificarPostulante(req.body);
    res.send(jsonRes);

});

//Registrar Convocatoria
router.post('/convocatoria/registrar',async function (req,res){ //Aqui ira el registro de convocatorias
    let jsonRes={}
    jsonRes.nuevo_id_convocatoria=await convocatoriaController.registraConvocatoria(req.body);
    res.send(jsonRes);


});



//devuelve convocatoria
router.get('/convocatoria/devolver', async function(req, res) {
    let jsonBlock={};
    jsonBlock = await convocatoriaController.devuelveConvocatoria(req.query);

    res.send(jsonBlock);

});


module.exports = router;
