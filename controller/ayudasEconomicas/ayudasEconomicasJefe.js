var winston = require('../../config/winston');
const dbCon = require('../../config/db');
const Sequelize = require ('sequelize');
const dbSpecs = dbCon.connect()

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

//CODIGO DE  MOISES
function prueba (preferencesObject){
    return "prueba";
}

async function devuelveAyudasEconomicas(preferencesObject){
    try{
        let jsonAyudaEconomica
        console.log(preferencesObject.ciclo);
        let ciclo = await sequelize.query(`call devuelveIdCiclo(:ciclo)`,
            {
                replacements:{
                    ciclo:preferencesObject.ciclo
                }
            }
            );

        if (ciclo == undefined || ciclo[0]==undefined || ciclo.length==0)
            return -1;
        else {


            console.log(ciclo);
            let ayudas=await sequelize.query(`call devuelveAyudasEconomicas(:ciclo)`,
                {
                    replacements:{
                        ciclo:preferencesObject.ciclo
                    }
                });
            console.log(JSON.stringify(ayudas));
            jsonAyudaEconomica = await Promise.all(ayudas.map(async item =>{
                let innerPart ={};
                let profesor={};

                innerPart.id=item.id;
                innerPart.codigo_solicitud=item.codigo_solicitud;
                innerPart.titulo=item.titulo;
                innerPart.motivo=item.motivo;
                innerPart.monto_otorgado=item.monto_otorgado;
                innerPart.estado=item.estado;
                innerPart.fecha_solicitud=item.fecha_solicitud;

                profesor.codigo_profesor=item.codigo_profesor;
                profesor.nombres=item.nombres;
                profesor.apellido_paterno=item.apellido_paterno;
                profesor.apellido_materno=item.apellido_materno;
                profesor.correo_pucp=item.correo_pucp;
                profesor.tipo_profesor=item.tipo_profesor;
                profesor.seccion=item.seccion;

                innerPart.profesor=profesor;
                return innerPart;

            }));

            winston.info("devuelveAyudasEconomicas successful");
            return jsonAyudaEconomica;
        }
    }catch(e){
        winston.error("devuelveAyudasEconomicas failed");
    }

}
async function devuelveAyudasEconomicasFiltro(preferencesObject){
    try{
        //codigo_inv=1&titulo=AAAA&profesor=2011111&seccion=
        //AAAA&motivo=AAAAA&estado=AAAA&montoMin=200
        // &montoMAX=300&fecha_inicio=02/06/18& fecha_fin=02/06/2018

        // let ayudas = await sequelize.query('call devuelveAEFiltro(:codigo_inv,:titulo,:profesor,:seccion,:motivo,:estado,:montoMin,:montoMax,:fecha_inicio,:fecha_fin)',
        //     {
        //        replacements:{
        //
        //        }
        //     });
    }catch (e){
        winston.error("devuelveAyudasEconomicas")
    }
}
module.exports={
    devuelveAyudasEconomicas:devuelveAyudasEconomicas
}
