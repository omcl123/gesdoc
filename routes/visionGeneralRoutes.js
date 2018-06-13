const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/vistaGeneral/vistaGeneral');
const dashController = require('../controller/vistaGeneral/dashboard');
const VerifyToken = require('../auth/VerifyToken');

//departamento
router.get('/listaCurso',VerifyToken, async function (req, res) {
    let queryResult= {};

    let user = req.body.verifiedUser;
    if (user.id_cargo===3||user.id_cargo===4 ) {
        queryResult.curso = await dashController.listaCurso(req.body);
        res.send(queryResult) ;
    }else{
        return res.status(300).send('Invalid Permits');
    }
});
router.get('/listarAyudasEconomicas',VerifyToken,async function(req,res){
    let jsonBlock ={};
    let user = req.body.verifiedUser;
    if (user.id_cargo===3||user.id_cargo===4 ) {
        //console.log(req.query);
        jsonBlock.ayudas = await  dashController.listarAyudasEconomicas(req.query, req.body);
        console.log(jsonBlock);
        res.send(jsonBlock);
    }else{
        return res.status(300).send('Invalid Permits');
    }

});
router.get('/listarAyudasEconomicasSeccion',VerifyToken,async function(req,res){
    let jsonBlock ={};
    let user = req.body.verifiedUser;
    if (user.id_cargo===3||user.id_cargo===4 ) {
        //console.log(req.query);
        jsonBlock.ayudas = await  dashController.listarAyudasEconomicasSeccion(req.query, req.body);
        console.log(jsonBlock);
        res.send(jsonBlock);
    }else{
        return res.status(300).send('Invalid Permits');
    }

});

router.get('/investigacionesAnoDepartamento',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 ||user.id_cargo === 4  ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.investigacionesAnoDepartamento(req.query,user.unidad);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/apoyoEconomicoAnoDepartamento',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 ||user.id_cargo === 4  ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.apoyoEconomicoAnoDepartamento(req.query,user.unidad);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/docentesTipoDepartamento',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 ||user.id_cargo === 4  ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.docentesTipoDepartamento(req.query,user.unidad);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/actividadesTipoDepartamento',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4  ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.actividadesTipoDepartamento(req.query,user.unidad);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/apoyoEconomicoEstadoDepartamento',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4  ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.apoyoEconomicoEstadoDepartamento(req.query,user.unidad);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/convocatoriaEstadoDepartamento',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.convocatoriaEstadoDepartamento(req.query,user.unidad);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

//seccion

router.get('/docentesTipoSeccion',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.docentesTipoSeccion(req.query);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/actividadesTipoSeccion',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.actividadesTipoSeccion(req.query);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/apoyoEconomicoEstadoSeccion',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.apoyoEconomicoEstadoSeccion(req.query);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/convocatoriaEstadoSeccion',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 || user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.convocatoriaEstadoSeccion(req.query);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/investigacionesAnoSeccion',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 ||user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.investigacionesAnoSeccion(req.query);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

router.get('/apoyoEconomicoAnoSeccion',VerifyToken,async function(req, res) {
    let jsonblock;
    let user = req.body.verifiedUser;
    if (user.id_cargo=== 3 ||user.id_cargo === 4 || user.id_cargo === 2 ) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
        jsonblock = await dashboardController.apoyoEconomicoAnoSeccion(req.query);
        res.send(jsonblock);
    }else {
        return res.status(500).send('Invalid Permits');
    }
});

module.exports = router;
