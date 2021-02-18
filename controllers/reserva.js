require("dotenv").config();
const db = require('../mysql');
const fs = require('fs'); 
const path = require('path'); 
const { sendMail, createPDF } = require('../helpers/helpers');


const getReservasByUser = async(req, res) => {

    const { id } = req.params;

    if(!id) {
        return res.status(400).send({
            ok: false,
            message: 'No se ha recibido el id del usuario'
        })
    }

    try{

        let sql = `SELECT *,DATE_FORMAT(v.fecha_salida, "%d-%m-%Y") as formato_fecha,DATE_FORMAT(r.fecha, "%d-%m-%Y") as formato_fecha_reserva 
                    FROM  vuelo v, reserva r WHERE r.vuelo_id = v.id AND user_id = ?`;

        let response = await db.performQuery(sql, [id]);
            

            if (!response) {
              
              return res.status(400).send({
                ok: false,
                message: "La reserva no se ha guardado",
              });
            
            }

            return res.status(201).send({
                
                ok: true,
                data: response
            });
      

    }catch(error){
       console.log(error)
       return res.send({
           ok: false,
           error:error
       })
    }
}

const getReservaById = async(req, res) => {

    const { id } = req.params;

    if(!id){
        return res.status(400).send({
            ok: false,
            message: 'No se ha recibido el id de la reserva'
        })
    }

    try{

        let sql = `SELECT * FROM vuelo v, reserva r, pasajeros_reserva pr
                           WHERE v.id = r.vuelo_id
                           AND pr.reserva_id = r.id 
                           AND r.id = ? ORDER BY r.fecha ASC`;

        let response = await db.performQuery(sql, [id]);

        return res.status(200).send({
            ok: true,
            data: response
        });
        
    }catch(e){
        console.log(e);
        return res.status(500).send({
            ok: false,
            error: error
        })
    }
}

const create = async(req, res) => {

   console.log(req.body);
    const { user_id, vuelo_id, n_personas, n_maletas, precio, seguro_viaje, transporte, datos_contacto, datos_pasajeros, tarifa } = req.body;

   if(!user_id || !vuelo_id || !n_personas || !precio || !datos_contacto || !datos_pasajeros || !tarifa) {
        return res.status(400).send({
            ok: false,
            message: 'Faltan datos por recibir'
        })
    }

    try{

        const {contacto_email, contacto_telefono } = datos_contacto;

        let sql = 'INSERT INTO reserva (user_id, vuelo_id, n_pasajeros, n_maletas, precio_total, seguro_viaje, transporte, contacto_email, contacto_telefono, tarifa) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )';
        let response = await db.performQuery(sql, [user_id, vuelo_id, n_personas, n_maletas, precio, seguro_viaje, transporte, contacto_email, contacto_telefono, tarifa]);
            
        if (!response) {
            
            return res.status(400).send({
                ok: false,
                message: "Error al registrar la reserva",
                error: err,
            });

        }

        //recogemos el id de la última reserva insertada
        const idReserva = response.insertId;
        
        //insertamos los datos de los pasajeros de la reserva en la tabla dependiente
        const { nombre, apellido1, apellido2 } = datos_pasajeros;

        let sql2 = 'INSERT INTO pasajeros_reserva (nombre, apellido1, apellido2, reserva_id) values (?,?,?,?)';

        let response2 = await db.performQuery(sql2,[nombre, apellido1, apellido2, idReserva]);

        if(!response2){
            return res.status(400).send({
                ok: false,
                message: "Error al registrar los datos de los pasajeros",
                error: err,
            });
        }

        try{
            let respuestaPdfReserva = await createPDF(idReserva, 'Reserva');
            console.log(respuestaPdfReserva)
        }catch(e){
            console.log(e);
        }

        if(transporte !== 0){
            try{
                let respuestaPdfTransporte =  await createPDF(idReserva, 'Transporte')
                console.log(respuestaPdfTransporte);
            }catch(e){
                console.log(e)
            }
       
        }

        try{
           await sendMail('quique@reiduarig.com', 'Reserva registrada','Se ha realizado la reserva correctamente');
        }catch(error){
            console.log(error);
        }

        return res.status(201).send({
            ok: true,
            message: "Reserva registrada",
        });    
            
        

    }catch(error){
        console.log(error)
        return res.send({
            ok: false,
            message: error.message,
        });    
    }

}

const cancelarReserva = async(req, res) => {

    const { id } = req.params;

    const sql = 'UPDATE reserva SET estado = "cancelada" WHERE id = ?';

    let response = await db.performQuery(sql, [id]);

    if (!response) {
            
        return res.status(400).send({
            ok: false,
            message: "Error al cancelar la reserva",
            error: err,
        });

    }

    return res.status(200).send({
        ok: true,
        message: "Reserva cancelada"
    })
}
const getDocumentsByReserva = async(req, res) => {

    const reservaId = req.params.id;

    try{

        let sql = 'SELECT * FROM documentos WHERE reserva_id = ?';

        let response = await db.performQuery(sql, reservaId);

        console.log(response)
        if (!response) {
              
            return res.send({
              ok: false,
              message: "El documento no se ha guardado",
            });
          
          }
        
          if(response.length === 0){
            return res.send({
                ok: false,
                message: "No hay documentos",
              });
          }

         

          return res.status(201).send({
              
              ok: true,
              data: response
          });

    }catch(error){
        console.log(error);
        return res.send({
            ok: false,
            error: error
        })
    }
}

const getImage = async(req, res) => {

    const { id } = req.params;
        
    const file_path = `./uploads/documents/reservas/${id}`;

    try{

        let existe;

        await fs.stat(file_path,(error, stats)=> {

            if (error) { 
                existe = false;
            } 
            else { 
               if(stats.isFile()){
                    existe = true;
               }
               
            }  

        });

     
            
        return await res.sendFile(path.resolve(file_path));
       
     
    }catch(e){
        console.log(e)
        return res.status(404).send({
            ok: false,
            message: 'La imagen no existe'
        });
    }
    
}

const uploadDocuments = async(req, res) => {
    
    let filename = 'Documento no subido';

    const { files } = req.files;

    if(!files){
        return res.send({
            ok: false,
            message: 'No existen archivos'
        });
    }

   
    //conseguir el nombre y la extension del archivo
    let file_path = files.path;
    let file_split = file_path.split('\\'); //separar los segmentos de la ruta
    filename = file_split[2]; //nombre
    let ext_split = filename.split('\.'); //extension
    let ext_file = ext_split[1];
    
    //comprobar la extension, si no es válida, borrar el fichero subido
    if(ext_file != 'txt' && ext_file != 'csv' && ext_file != 'jpeg' && ext_file != 'gif' && ext_file != 'png' && ext_file != 'pdf'){
        fs.unlink(file_path,(err)=>{ //permite borrar archivos
            return res.status(400).send({
                ok: false,
                message: 'La extensión del archivo no es válida'
            });
        
        }); 
    }else{
        //sacar el id de la reserva 
        let reservaId = req.reserva;
        //actualizar el objeto usuario
        res.send({
            ok: true
        })
    }
}


 
module.exports = {
    getReservasByUser,
    getReservaById,
    cancelarReserva,
    getImage,
    create,
    getDocumentsByReserva,
    uploadDocuments
}
