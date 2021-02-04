'use strict'

const express = require('express');
const userController = require('../controllers/user');
const fileUpload = require('express-fileupload');
const router = express.Router();
const { check } = require("express-validator");
const multipart = require('connect-multiparty');

//middleware 
let md_upload = multipart({ uploadDir: './uploads/users' }); //ruta donde se van a guardar todas las imagenes de los usuarios
const { validarCampos } = require("../middlewares/validation");
/* -----------  Rutas ----------------------*/
//User
router.get('/', userController.index);
router.get('/:id',[
    check("id", "Id requerido").not().isEmpty(),
    validarCampos
    ], userController.getUser);
router.get('/all/:id',[
    check("id", "Id requerido").not().isEmpty(),
    validarCampos
    ], userController.getDatosAll);
router.put('/:id',[
    check("id", "Id requerido").not().isEmpty(),
    check("username", "Username requerido").not().isEmpty(),
    check("email", "Email requerido").not().isEmpty(),
    validarCampos
    ],md_upload, userController.update);
router.delete('/:id',[
    check("id", "Id requerido").not().isEmpty(),
    validarCampos
    ], userController.deleteUser);


//Image
//cargar el middleware de authenticate a la ruta
router.post('/upload-image/:id',md_upload, userController.uploadImage);
router.get('/image/:filename', userController.getImage);

module.exports = router;