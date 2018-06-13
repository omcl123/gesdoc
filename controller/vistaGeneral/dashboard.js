const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
var winston = require('../../config/winston');
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

async function listarAyudasEconomicas(preferencesObject,bodyUser){
    try{
        let user = bodyUser.verifiedUser;
        let ayudas = await sequelize.query('call dashboardListarAyudas(:id_departamento)',{
            replacements:{
                id_departamento:user.unidad
            }
        });

       // console.log(ayudas);
        let jsonAyudas =await Promise.all(ayudas.map(async item => {
            let innerPart = {};
            let profesor={};
            innerPart.id=item.id;
            innerPart.codigo_solicitud=item.codigo;
            innerPart.titulo=item.titulo;

            profesor.id=item.id_profesor;
            profesor.nombres=item.nombres;
            profesor.apellido_paterno=item.apellido_paterno;
            profesor.apellido_materno=item.apellido_materno;
            profesor.codigo_profesor=item.codigo_profesor;
            profesor.correo_pucp=item.correo_pucp;
            profesor.seccion=item.seccion;
            profesor.tipo_profesor=item.tipo_profesor;

            innerPart.motivo=item.motivo;
            innerPart.monto_otorgado=item.monto;
            innerPart.estado=item.estado;
            innerPart.fecha_solicitud=item.fecha_solicitud;
            innerPart.profesor=profesor;
            return innerPart;
        }));
        winston.info("listarAyudasEconomicas success");
        return jsonAyudas;
    }catch(e){
        winston.error("listarAyudasEconomicas error");
        return "error";
    }
}
async function listarAyudasEconomicasSeccion(preferencesObject,bodyUser){
    try{
        let user = bodyUser.verifiedUser;

        let ayudas = await sequelize.query('call dashboardListarAyudasSeccion(:id_departamento,:seccion)',{
            replacements:{
                id_departamento:user.unidad,
                seccion:parseInt(preferencesObject.seccion)
            }
        });

        // console.log(ayudas);
        let jsonAyudas =await Promise.all(ayudas.map(async item => {
            let innerPart = {};
            let profesor={};
            innerPart.id=item.id;
            innerPart.codigo_solicitud=item.codigo;
            innerPart.titulo=item.titulo;

            profesor.id=item.id_profesor;
            profesor.nombres=item.nombres;
            profesor.apellido_paterno=item.apellido_paterno;
            profesor.apellido_materno=item.apellido_materno;
            profesor.codigo_profesor=item.codigo_profesor;
            profesor.correo_pucp=item.correo_pucp;
            profesor.seccion=item.seccion;
            profesor.tipo_profesor=item.tipo_profesor;

            innerPart.motivo=item.motivo;
            innerPart.monto_otorgado=item.monto;
            innerPart.estado=item.estado;
            innerPart.fecha_solicitud=item.fecha_solicitud;
            innerPart.profesor=profesor;
            return innerPart;
        }));
        winston.info("listarAyudasEconomicas success");
        return jsonAyudas;
    }catch(e){
        winston.error("listarAyudasEconomicas error");
        return "error";
    }
}

async function listaCurso(bodyUser){
    try{
        let user = bodyUser.verifiedUser;
        let cursos= await sequelize.query('call dashBoardDevuelveCurso(:departamento)',{
            replacements:{
                departamento:user.unidad
            }

        });
        console.log(cursos);
        winston.info("listaCurso success");
        return cursos;
    } catch( e){
        winston.error("listaCurso failed: ",e);
        return "error";

    }
}
async function listaCursoSeccion(bodyUser){
    try{
        let user = bodyUser.verifiedUser;
        let cursos= await sequelize.query('call dashBoardDevuelveCursoSeccion(:seccion)',{
            replacements:{
                seccion:user.unidad
            }

        });
        console.log(cursos);
        winston.info("listaCurso success");
        return cursos;
    } catch( e){
        winston.error("listaCurso failed: ",e);
        return "error";

    }
}
module.exports = {
    listarAyudasEconomicas:listarAyudasEconomicas,
    listarAyudasEconomicasSeccion:listarAyudasEconomicasSeccion,
    listaCurso:listaCurso,
    listaCursoSeccion:listaCursoSeccion
};