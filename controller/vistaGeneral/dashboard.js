const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect();
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

async function listarAyudasEconomicas(preferencesObject){
    try{
        let ayudas = await sequelize.query('call dashboardListarAyudas()');

        await Promise.all(ayudas.map(async item => {

        }));
    }catch(e){
        winston.error("listarAyudasEconomicas error");
        return "error";
    }
}
module.exports = {
    listarAyudasEconomicas:listarAyudasEconomicas
};