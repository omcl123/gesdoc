const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbCon = require('../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect();
const config = require('../config/config');

const sequelize= new Sequelize(dbSpecs.db, dbSpecs.user, dbSpecs.password, {
    host: dbSpecs.host,
    dialect: dbSpecs.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register',async  function(req, res) {

    try {
        console.log(req.body);
        let nombres = req.body.nombres;
        let apellido_materno = req.body.apellido_materno;
        let apellido_paterno = req.body.apellido_paterno;
        let dni = req.body.dni;
        let telefono = req.body.telefono;
        let tipoUsuario = req.body.id_tipo_usuario;
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        let codigo = req.body.codigo;
        let email = req.body.correo;
        let unidad;
        if (req.body.id_tipo_usuario === 3 || req.body.id_tipo_usuario === 4){
            unidad  = req.body.id_departamento;
        }else {
            unidad  = req.body.id_seccion;
        }

        let esRepetido = await sequelize.query(`call verifica_usuario_repetido(${codigo})`);

        console.log(await esRepetido[0].esRepetido);
        if (await esRepetido[0].esRepetido === 0){
            let personaExiste = await sequelize.query(`call verifica_persona_existente('${email}')`);
            console.log(await esRepetido[0].idPersona);
            if (await personaExiste[0].idPersona === 0){
                await sequelize.query(`call registra_nuevo_usuario('${nombres}','${apellido_materno}','${apellido_paterno}'
            ,${dni},${telefono},${codigo},'${email}','${hashedPassword}',${tipoUsuario},${unidad});`);
            }else {
                await sequelize.query(`call registra_nuevo_usuario_persona_existente(${personaExiste[0].idPersona},
                '${hashedPassword}',${tipoUsuario},${unidad});`);
            }
            return res.status(200).send("User succesfully registered");
        } else {
            return res.status(500).send("User already exist.");
        }
    } catch (e){
        return res.status(500).send("There was a problem registering the user.");
    }

});

router.post('/login',async function(req, res) {
    try {
        let codigo = req.body.codigo;
        let existe = await sequelize.query(`call existe_usuario(${codigo});`);
        console.log(existe);
        if (await existe[0].id_cargo === undefined) return res.status(404).send('No user found.');
        else{
            let user = await sequelize.query(`call encuentra_usuario(${codigo},${existe[0].id_cargo});`);
            console.log(user);
            let passwordIsValid = bcrypt.compareSync(req.body.password, user[0].password);
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
            let token = jwt.sign({ id: user[0].id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send
            ({ auth: true, token: token ,user:{id:user[0].id,nombre:user[0].nombre,unidad:user[0].unidad,tipo_usuario:user[0].id_cargo}});
        }
    }catch(e){
        return res.status(500).send('Error on the server.');
    }

});

router.get('/verificaPermiso',async  function(req, res) {
    try {
        let token = req.headers['x-access-token'];
        if (!token)
            return res.status(403).send({ auth: false, message: 'No token provided.' });
        jwt.verify(token, config.secret, async function (err, decoded) {
            if (err)
                return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
            // if everything good, save to request for use in other routes
            let userResponse = await sequelize.query(`CALL devuelve_datos_permiso_usuario(${decoded.id})`);
            console.log(userResponse);
            let id_cargo = userResponse[0].id_cargo;
            let ruta = decodeURIComponent(req.query.ruta);
            let tienePermiso = await sequelize.query(`call verifica_ruta_usuario(${id_cargo},'${ruta}')`);
            if (tienePermiso[0].tiene === 1){
                return res.status(200).send({permiso: true});
            } else {
                return res.status(200).send({permiso: false});
            }
        });

    }catch(e){
        return res.status(500).send('Error on the server.');
    }

});
module.exports = router;