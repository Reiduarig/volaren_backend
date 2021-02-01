'use strict'

const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const multipart = require('connect-multiparty');

//middleware 
let md_upload = multipart({ uploadDir: './uploads/documents' }); //ruta donde se van a guardar todas las imagenes de los usuarios
const { validarCampos } = require("../middlewares/validation");

const reservaController = require('../controllers/reserva');

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

router.get('/historicos/:id',[
  check("id", "Id de reserva requerido").not().isEmpty(),
], reservaController.getReservasByUser);

router.put('/cancelar/:id',[
  check("id", "Id de reserva requerido").not().isEmpty(),
],reservaController.cancelarReserva);

router.get('/pdf/:id',[
  check("id", "Id de reserva requerido").not().isEmpty(),
 ], reservaController.getImage);
router.get('/documents/:id',[
  check("id", "Id de reserva requerido").not().isEmpty(),
 ], reservaController.getDocumentsByReserva);

 router.post('/documents',md_upload, reservaController.uploadDocuments);


module.exports = router;