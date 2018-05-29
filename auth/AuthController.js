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

    let hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let codigo = req.body.codigo;
    let email = req.body.email;
    let tipoUsuario  = req.body.tipoUsuario;
    let unidad  = req.body.unidad;
    try {
        let userId =
            await sequelize.query(`call registra_nuevo_usuaro(${codigo},'${email}','${hashedPassword}','${tipoUsuario}', '${unidad}');`);
        let token = await jwt.sign({ id: userId ,tipoUsuario: tipoUsuario,unidad: unidad}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        return res.status(200).send({ auth: true, token: token });
    } catch (e){
        return res.status(500).send("There was a problem registering the user.")
    }

});
