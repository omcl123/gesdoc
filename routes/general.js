const express = require('express');
const router = express.Router();
const listaController = require('../controller/general/listas');
const VerifyToken = require('../auth/VerifyToken');

router.get('/listaDocente',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.docentes = await listaController.listaDocente(req.body.verifiedUser);
    res.send(queryResult) ;
});

router.get('/listaCiclos',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.ciclos = await listaController.listaCiclos();
    res.send(queryResult) ;
});

router.get('/listaSecciones',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.secciones = await listaController.listaSeccciones();
    res.send(queryResult) ;
});

router.get('/listaMotivosAyudaEc',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.motivos = await listaController.listaMotivosAyudaEc();
    res.send(queryResult) ;
});

router.get('/listaEstadosAyudaEc',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.estados = await listaController.listaEstadosAyudaEc();
    res.send(queryResult) ;
});

router.get('/cicloActual',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.cicloActual = await listaController.cicloActual();
    res.send(queryResult) ;
});
router.get('/listaPais',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.pais = await listaController.listaPais();
    res.send(queryResult) ;
});
router.get('/listaCurso',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.curso = await listaController.listaCurso();
    res.send(queryResult) ;
});
router.get('/listaTipoDocumento',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.tipo_documento = await listaController.listaTipoDocumento();
    res.send(queryResult) ;
});
router.get('/listaTipoActividad',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.tipo_actividad = await listaController.listaTipoActividad();
    res.send(queryResult) ;
});

router.get('/listaTipoUsuarios',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.tipos = await listaController.listaTipoUsuarios();
    res.send(queryResult) ;
});
router.get('/listaDepartamentos',VerifyToken, async function (req, res) {
    let queryResult= {};
    queryResult.tipos = await listaController.listaDepartamentos();
    res.send(queryResult) ;
});
router.get('/listaSecciones',VerifyToken, async function (req, res) {
    let queryResult = {};
    queryResult.tipos = await listaController.listaSecciones(req.query);
    res.send(queryResult);
});
router.get('/listaProfesorSeccion',VerifyToken,async function (req,res){
   let queryResult={};
   queryResult.profesor=await listaController.listaProfesoresSeccion(req.query);
   res.send(queryResult);
});
router.get('/listaProfesorTipo',VerifyToken,async function (req,res){
    let queryResult={};
    queryResult.profesor=await listaController.listaProfesoresTipo(req.query);
    res.send(queryResult);

});
router.get('/listaProfesorW',VerifyToken,async function (req,res){
    let queryResult={};
    queryResult.profesor=await listaController.listaProfesoresW(req.query);
    res.send(queryResult);

});
router.get('/listaDocumentoPagoTipo',VerifyToken,async function (req,res){
    let queryResult={};
    queryResult.profesor=await listaController.listaDocumentoPagoTipo(req.query);
    res.send(queryResult);

});


module.exports = router;
