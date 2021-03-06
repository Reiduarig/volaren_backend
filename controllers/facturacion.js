//importar el módulo servicio jwt creado para la generación del token
const db = require('../mysql')


const updateFacturacion = async(req, res) => {

    const id = req.params.id
    const { nombre, apellido1, apellido2, dni, telefono, direccion, ciudad, cod_postal, provincia, pais, fecha_caducidad, numero_tarjeta, cod_seguridad} = req.body;
        
    try{
        
        const sql = `SELECT count(*) as existenDatos FROM datos_facturacion WHERE user_id = ?`;
       
        const response = await db.performQuery(sql,[id]);
        const actualizar = response[0].existenDatos;

       if(actualizar !== 0){
           
            const sql = `UPDATE datos_facturacion 
                        SET nombre = ?,
                        apellido1 = ?,
                        apellido2 = ?,
                        dni = ?,
                        telefono = ?,
                        direccion = ?,
                        ciudad = ?,
                        cod_postal = ?,
                        provincia = ?,
                        pais = ?,
                        fecha_caducidad = ?,
                        numero_tarjeta = ?,
                        cod_seguridad = ? 
                        WHERE user_id = ?`;

            let response = await db.performQuery(sql, [nombre, apellido1, apellido2, dni, telefono, direccion, ciudad, cod_postal, provincia, pais, fecha_caducidad, numero_tarjeta, cod_seguridad, id]);              

           console.log(sql)
        
            if(!response){
                return res.status(400).send({
                    ok: false,
                    message: 'Error al actualizar los datos de facturación'
                });
            }

            return res.status(200).send({
                ok: true,
                message:"Datos de facturación actualizados"
            })
        

        }else{
                const sql2 = `INSERT INTO datos_facturacion  (nombre, apellido1, apellido2, dni, telefono, direccion, ciudad ,
                                                            cod_postal, provincia, pais, fecha_caducidad, numero_tarjeta, cod_seguridad, user_id)
                                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)`;

                let response = await db.performQuery(sql2, [nombre, apellido1, apellido2, dni, telefono, direccion, ciudad, cod_postal, provincia, pais, fecha_caducidad, numero_tarjeta, cod_seguridad, id]);              

                console.log(sql2)

                if(!response){
                    return res.status(400).send({
                        ok: false,
                        message: 'Error al insertar los datos de facturación'
                    });
                }

                return res.status(200).send({
                    ok: true,
                    message:"Datos de facturación registrados"
                })
        }

    }catch(e){
        console.log(e);
    }   

}

module.exports = {
   
    updateFacturacion
   
};