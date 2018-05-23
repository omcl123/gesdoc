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


async function listarPostulante(preferencesObject){
    let arregloInv = [];
    try{
        let postulantes = await sequelize.query('CALL devuelvePostulantes(:id_convocatoria)',
            {
                replacements: {
                    id_convocatoria: parseInt(preferencesObject.id),


                }
            }
        );
        console.log(postulantes);
        //p.nombres, p.apellido_paterno,p.apellido_materno,p.correo,p.fecha_nacimiento,p.numero_documento,
        // t.descripcion as 'tipo_documento',x.descripcion as 'sexo',s.nombre as 'pais_nacimiento',
        // p.lugar_nacimiento,p.direccion_domicilio,i.nombre as 'pais_domicilio',p.telefono,p.celular,d.descripcion as 'estado_postulante'
        let jsonPostulantes = await Promise.all(postulantes.map(async item => {
            let innerPart={};
            innerPart.id=item.id;
            innerPart.nombres=item.nombres;
            innerPart.apellido_paterno=item.apellido_paterno;
            innerPart.apellido_materno=item.apellido_materno;
            innerPart.correo=item.correo;
            innerPart.fecha_nacimiento=item.fecha_nacimiento;
            innerPart.numero_documento=item.numero_documento;
            innerPart.tipo_documento=item.tipo_documento;
            innerPart.sexo=item.sexo;
            innerPart.pais_nacimiento=item.pais_nacimiento;
            innerPart.lugar_nacimiento=item.lugar_nacimiento;
            innerPart.direccion_domicilio=item.direccion_domicilio;
            innerPart.pais_domicilio=item.pais_domicilio;
            innerPart.telefono=item.telefono;
            innerPart.celular=item.celular;
            innerPart.estado_postulante=item.estado_postulante;

            return innerPart;
        }));
        console.log(jsonPostulantes);
        winston.info("listarPostulante succesful");
        return jsonPostulantes;
        //return arregloInv;
    }catch(e){
        console.log(e);
        winston.error("listarPostulante failed");
    }
}
module.exports  ={
    listarPostulante:listarPostulante
}