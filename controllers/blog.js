'use strict'

//importar el módulo servicio jwt creado para la generación del token
const db = require('../mysql')

const fs = require('fs').promises; //librería de node para trabajar con el sistema de ficheros
const path = require('path'); //librería path de node

 const getPosts = async(req, res) => {

    try{

        let sql = 'SELECT p.*, u.username FROM posts p, usuario u WHERE u.id = p.user_id ORDER BY fecha DESC';

    
        let response = await db.performQuery(sql);
        
        if(!response){
            return res.status(400).send({
                ok: false,
                message: 'Error en la consulta de los posts'
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
                    message: 'No existen posts',
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
 
 const getPost = async(req, res, next) => {

    console.log(req.params)

    const { id } = req.params;

    if(!id){
        return res.status(400).send({
            ok: false,
            message: 'No se ha recibido el id de post'
        })
    }

    try{

        let sql = "SELECT * FROM posts WHERE id = ?";
        
        let response = await db.performQuery(sql, id);
            if(!response){
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta del post'
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
                        message: 'El post no existe',
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

 const getPostsByUser = async(req, res, next) => {

    try{
    
        const { id } = req.params;
        
        let sql = "SELECT *  FROM posts WHERE user_id =  ? ";
        
        let response = await db.performQuery(sql, id);

            if(!response){
               
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta de los posts'
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
                        message: 'El post no existe',
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
const getPostsBySearch = async(req, res, next) => {

    try{
    
        const { search } = req.params;
        
        let sql = `SELECT *  FROM posts WHERE title LIKE '${search}_%'`;

        console.log(sql)
        
        let response = await db.performQuery(sql);

            if(!response){
               
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta de los posts'
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
                        message: 'El post no existe',
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

const createPost = async(req, res) => {

    console.log(req.body)

    const {title, description, id} = req.body;

    try{

        const sql = "Insert into posts (title, description, user_id) values ( ?, ?, ? )";
        const response = await db.performQuery(sql, [title, description, id]);

        if(!response){
            return res.status(400).send({
                ok: false,
                message: 'Error en la consulta'
            });
        }else{
                
            return res.status(200).send({
                ok: true,
                message: 'Post registrado',
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

 const updatePost = async(req, res) => {

   
        const id = req.params.id;
        const { title, description } = req.body;
       

        try{
            let sql = "update posts set title = ? , description = ? WHERE id = ?";
             
            let response = await db.performQuery(sql, [title, description, id]);

            if(!response){
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta'
                });
            
            }else{
                
                    return res.status(200).send({
                        ok: true,
                        message: 'Post actualizado',
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


 const deletePost = async(req, res) => {

    try{
	
        const { id } = req.params;
       
        const sql = "DELETE FROM posts WHERE id = ?";

        let response = await db.performQuery(sql,id)
            if(!response){
                return res.status(400).send({
                                ok: false,
                                message: 'Error al eliminar el post'
                            });
            }

            return res.status(200).send({
                            ok: true,
                            message: 'Post eliminado',
                            deletedPost: id
                    });
        
    }catch(e){
        return res.status(500).send({
            ok: false,
            message: 'Error interno del servidor',
            error: e
        });
    }    
 }	
 
 
 const uploadImage = async(req, res) => {
	
    
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
        let sql = 'UPDATE posts SET imagen = ? WHERE id = ?';

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
        
    const file_path = `./uploads/posts/${filename}`;

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

module.exports= {
    getPosts,
    getPost,
    getPostsByUser,
    getPostsBySearch,
    createPost,
    updatePost,
    deletePost,
    uploadImage,
    getImage
}