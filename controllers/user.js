'use strict'

//importar el módulo servicio jwt creado para la generación del token
const db = require('../mysql')

const fs = require('fs').promises; //librería de node para trabajar con el sistema de ficheros
const path = require('path'); //librería path de node

 const index = async(req, res) => {

    try{

        let sql = 'SELECT * FROM usuario';

    
        let response = await db.performQuery(sql);
        
        if(!response){
            return res.status(400).send({
                ok: false,
                message: 'Error en la consulta del usuario'
            });
        }else{
            if(response.length > 0){

                return res.status(200).send({
                    ok: true,
                    data: response
                });
            }else{
                return res.status(400).send({
                    ok: false,
                    message: 'No existen usuarios',
                    data:[]
                });
            }    
        }    
        
    }catch(error){
        return res.status(500).send({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
    
 }   
 
 const getUser = async(req, res, next) => {


    const { id } = req.params;

    if(!id){
        return res.status(400).send({
            ok: false,
            message: 'No se ha recibido el id de usuario'
        })
    }

    try{

        let sql = "SELECT * FROM usuario WHERE id = ?";
        
        let response = await db.performQuery(sql, id);
            if(!response){
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta del usuario'
                });
            }else{
                if(response.length > 0){

                    return res.status(200).send({
                        ok: true,
                        data: response
                    });
                }else{
                    return res.status(400).send({
                        ok: false,
                        message: 'El usuario no existe',
                        data:[]
                    });
                }    
            }    
     
    }catch(error){
        return res.status(500).send({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
}

 const getDatosAll = async(req, res, next) => {

    try{
    
        const { id } = req.params;
        
        let sql = "SELECT f.*, u.*  FROM datos_facturacion f, usuario u WHERE f.user_id = u.id AND u.id = ? ";
        
        let response = await db.performQuery(sql, id);
            if(!response){
               
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta del usuario'
                });
            }else{
               
                if(response.length > 0){
                    return res.status(200).send({
                        ok: true,
                        data: response
                    });
                }else{
                    return res.status(400).send({
                        ok: false,
                        message: 'El usuario no existe',
                        data:[]
                    });
                }    
            }
        
    }catch(error){
        console.log(error);
        return res.status(500).send({
            ok: false,
            message: 'Error interno del servidor',
            error: error
        });
    }   
}

 const update = async(req, res) => {

   
        const id = req.params.id;
        const { username, email } = req.body;
       

        try{
            let sql = "update usuario set username = ? , email = ? WHERE id = ?";
             
            let response = await db.performQuery(sql, [username, email, id]);

            if(!response){
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta'
                });
            
            }else{
                
                    return res.status(200).send({
                        ok: true,
                        message: 'Usuario actualizado',
                    });
                
            }
        }catch(e){
            console.log(e);
            return res.status(500).send({
                ok: false,
                message: 'Error interno del servidor',
                error: e.message
            });
        }        
        
 }


 const deleteUser = async(req, res) => {

    try{
	
        const { id } = req.params;
        //find y delete
        const sql = "DELETE FROM usuario WHERE id = ?";

        let response = await db.performQuery(sql,id)
            if(!response){
                return res.status(400).send({
                                ok: false,
                                message: 'Error al eliminar el usuario'
                            });
            }

            return res.status(200).send({
                            status: true,
                            message: 'Usuario eliminado',
                            deletedUser: id
                    });
        
    }catch(e){
        return res.status(500).send({
            ok: false,
            message: 'Error interno del servidor',
            error: e
        });
    }    
 }	
 
 const uploadImageHackaboss= async(req, res) => {


    console.log(req.files)
    //Crear el directorio
    await fs.mkdir(`${process.env.UPLOADS_DIR/users/docs}`, {recursive:true})
    

    try{
        //asignar un id unico al archivo que se va a crear
        const fileId = uuid.v4();
        const directorioImages = `${process.env.UPLOADS_DIR}/users/docs/${fileId}`;
       
        await fs.writeFile(req.files.imagen.name, req.files.imagen.data)
       
        res.send();
    }catch(e){
        console.log('Error '. e);
        res.status(500).send()
    }

 }
 const uploadImage = async(req, res) => {
		
    //configurar el modulo multiparty en routes/user.js
    //recoger el fichero de la petición
    
    const id = req.params.id;
   
    let filename = 'Imagen no subida';
    
    if(!req.files){
        return res.send({
            status: 'error',
            message: 'No llegan archivos'
        });
    }
   
    //conseguir el nombre y la extension del archivo
    let file_path = req.files.file0.path;  //ruta
   
   
    let file_split = file_path.split('\\'); //separar los segmentos de la ruta
    filename = file_split[2]; //nombre
    let ext_split = filename.split('.'); //extraer la extension
    let ext_file = ext_split[1];
    
    //comprobar la extension, si no es válida, borrar el fichero subido
    if(ext_file != 'png' && ext_file != 'jpg' && ext_file != 'jpeg' && ext_file != 'gif'){
        fs.unlink(file_path,(err)=>{ 
            return res.status(200).send({
                status: 'error',
                message: 'La extensión del archivo no es válida'
            });
        
        }); 
    }else{
       
        //actualizar el objeto usuario
        let sql = 'UPDATE usuario SET imagen = ? WHERE id = ?';

        let respuesta = await db.performQuery(sql, [filename, id]);

        if(respuesta){
            res.send({
                ok: true,
                message: 'Imagen subida'
            })
        }
        else{
            res.send({
                ok: false,
                message: 'Error al subir la imagen'
            })
        }

    }
}
    //metodo para obtener una imagen
 const getImage = async(req, res) => {
        
    const { filename } = req.params;
        
    const file_path = `./uploads/users/${filename}`;

    try{

        const existe = await fs.stat(file_path);
            
        return res.sendFile(path.resolve(file_path));
     
    }catch(e){
        console.log(e)
        return res.status(404).send({
            ok: false,
            message: 'La imagen no existe'
        });
    }
}

const uploadDocument = async(req, res) => {

    //configurar el modulo multiparty en routes/user.js
    //recoger el fichero de la petición
    let filename = 'Documento no subido';

    
    console.log(req.files.files)
   
    const {id} = req.params
    console.log(id)
   
   // console.log(id)

    if(!req.files){
        return res.status(400).send({
            ok: false,
            message: 'No llegan documentos'
        });
    }
    //conseguir el nombre y la extension del archivo
    let file_path = req.files.files.path;

    let file_split = file_path.split('\\'); //separar los segmentos de la ruta
    filename = file_split[3]; //nombre
    console.log(filename)
    let ext_split = filename.split('\.'); //extension
    let ext_file = ext_split[1];
    
    //comprobar la extension, si no es válida, borrar el fichero subido
    if(ext_file != 'txt' && ext_file != 'csv' && ext_file != 'jpeg' && ext_file != 'gif' && ext_file != 'png' && ext_file != 'pdf'){
        await fs.unlink(file_path,(err)=>{ //permite borrar archivos
            return res.status(400).send({
                ok: false,
                message: 'La extensión del archivo no es válida'
            });
        
        }); 
    }else{
        //sacar el id del usuario identificado
        //actualizar el objeto usuario
        let sql = 'INSERT INTO user_docs (user_id, url, nombre) values(?,?,?)';

        let respuesta = await db.performQuery(sql, [id, filename, req.files.files.originalFilename]);

        console.log(respuesta)

        if(respuesta){
            return res.status(201).send({
                ok: true,
                message: 'Documento subido'
            })
        }
        else{
            return res.status(400).send({
                ok: false,
                message: 'Error al subir el documento'
            })
        }
    }
}
const getDocuments = async(req, res) => {
        
   
    const { user } = req.params;
   
    try{
        
        let sql = "SELECT * FROM user_docs WHERE user_id = ? ";
        
        let response = await db.performQuery(sql, user);
        console.log(sql)
            if(!response){
               
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta del usuario'
                });
            }else{
               
                if(response.length > 0){
                    return res.status(200).send({
                        ok: true,
                        data: response
                    });
                }else{
                    return res.status(200).send({
                        ok: false,
                        message: 'No hay documentos',
                        data:[]
                    });
                }    
            }
        
    }catch(error){
        console.log(error);
        return res.status(500).send({
            ok: false,
            message: 'Error interno del servidor',
            error: error
        });
    }   
}
const deleteDocument = async(req, res) => {

    const { id } = req.params;

    let sql = `DELETE FROM user_docs WHERE id = ?`;

    let response = await db.performQuery(sql, id);

    if(!response){
        return res.status(400).send({
                        ok: false,
                        message: 'Error al eliminar el documento'
                    });
    }

    return res.status(200).send({
                    status: true,
                    message: 'Documento eliminado',
                    deletedUser: id
            });

}

const getImageDocument = async(req, res) => {
        
    const { filename } = req.params;
        
    const file_path = `./uploads/users/docs/${filename}`;

    try{

        const existe = await fs.stat(file_path);
            
        return res.sendFile(path.resolve(file_path));
     
    }catch(e){
        console.log(e)
        return res.status(404).send({
            ok: false,
            message: 'La imagen no existe'
        });
    }
}
   /* try{

        const existe = await fs.stat(file_path);
            
        return res.sendFile(path.resolve(file_path));
     
    }catch(e){
        console.log(e)
        return res.status(404).send({
            ok: false,
            message: 'La imagen no existe'
        });
    }
}
    */
module.exports = {
    index,
    update,
    getUser,
    getDatosAll,
    deleteUser,
    getImage,
    uploadImage,
    uploadDocument,
    getDocuments,
    getImageDocument,
    deleteDocument,
    uploadImageHackaboss
};
