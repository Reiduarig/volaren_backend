'use strict'

const express = require('express');
const reservaController = require('../controllers/reserva');
const { check } = require("express-validator");

const router = express.Router();
const multipart = require('connect-multiparty');
const { validarCampos } = require("../middlewares/validation");

//middleware 
let md_upload = multipart({ uploadDir: './uploads/documents' }); //ruta donde se van a guardar todas las imagenes de los usuarios

/* -----------  Rutas ----------------------*/


router.get('/:id',[
   check("id", "Id de vuelo requerida").not().isEmpty(),
  ], reservaController.getReservaById);

router.post('/create',  [
    check("user_id", "Usuario requerido").not().isEmpty(),
    check("vuelo_id", "Vuelo requerido").not().isEmpty(),
    check("n_personas", "Personas requerido").not().isEmpty(),
    check("n_maletas", "Maletas requerida").not().isEmpty(),
    check("precio", "Precio requerido").not().isEmpty(),
    validarCampos
  ], reservaController.create );

router.get('/historicos/:id', reservaController.getReservasByUser);

router.put('/cancelar/:id', reservaController.cancelarReserva);

router.get('/pdf/:id', reservaController.getImage);
router.get('/documents/:id', reservaController.getDocumentsByReserva);
router.post('/documents',md_upload, reservaController.uploadDocuments);


module.exports = router;