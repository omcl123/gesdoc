const jwt = require('jsonwebtoken');
const config = require('../config/config');
const dbCon = require('../config/db');
const Sequelize = require('sequelize');
const dbSpecs =  dbCon.connect();
const sequelize = new Sequelize(dbSpecs.db, dbSpecs.user, dbSpecs.password, {
    host: dbSpecs.host,
    dialect: dbSpecs.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

function verifyTokenEconomia(req, res, next) {

    let token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, async function (err, decoded) {
        if (err)
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // if everything good, save to request for use in other routes
        let userResponse = await sequelize.query(`CALL devuelve_datos_permiso_usuario(${decoded.id})`);
        console.log(userResponse);
        let user = {};
        user.id = userResponse[0].id;
        user.nombre_usuario = userResponse[0].nombre_usuario;
        user.id_cargo = userResponse[0].id_cargo;
        let unidad = await
            sequelize.query(`CALL devuelve_unidad_usuario(${userResponse[0].nombre_usuario},${userResponse[0].id_cargo})`);
        user.unidad = unidad[0].unidad;

        if (user.id_cargo=== 3  && user.unidad===2) {// 2 secion , 3 jefe, 4 asis dep , 5 asis secc;
            user.tipo_query=1;//departamento;
        }else {
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        }
        req.body.verifiedUser = user;
        next();
    });
}
module.exports = verifyTokenEconomia;