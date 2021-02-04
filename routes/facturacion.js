'use strict'

const express = require('express');
const facturacionController = require('../controllers/facturacion');
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validation");

router.put('/:id',[
    check("nombre", "Nombre requerido").not().isEmpty(),
    check("apellido1", "Apellidos requeridos").not().isEmpty(),
    check("apellido2", "Apellidos requerido").not().isEmpty(),
    check("dni", "Dni requerido").not().isEmpty(),
    check("telefono", "Telefono requerido").not().isEmpty(),
    check("direccion", "Direccion requerida").not().isEmpty(),
    check("ciudad", "Ciudad requerida").not().isEmpty(),
    check("cod_postal", "Cod postal requerida").not().isEmpty(),
    check("provincia", "Provincia requerida").not().isEmpty(),
    check("pais", "Pais requerido").not().isEmpty(),
    check("fecha_caducidad", "Fecha de caducidad requerida").not().isEmpty(),
    check("numero_tarjeta", "Número de tarjeta requerida").not().isEmpty(),
    check("cod_seguridad", "Código seguridad requerido").not().isEmpty(),
    validarCampos
], facturacionController.updateFacturacion);    


module.exports = router;