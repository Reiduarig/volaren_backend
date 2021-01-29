'use strict'

const express = require('express');
const { check } = require("express-validator");


let vuelosController = require('../controllers/vuelos');
const { validarCampos } = require("../middlewares/validation");


const router = express.Router();

/* -----------  Rutas ----------------------*/

router.post('/',[
    check("origen", "Origen requerido").not().isEmpty(),
    check("destino", "Destino requerido").not().isEmpty(),
    check("n_personas", "N_pasajeros requerido").not().isEmpty(),
    check("idavuelta", "Campo vuelta requerido").not().isEmpty(),
    check("precio", "Campo precio requerido").not().isEmpty(),
    validarCampos
  ], vuelosController.getVuelos);
router.get('/:id',[
    check("id", "Id requerido").not().isEmpty(),
    validarCampos
    ], vuelosController.getVueloById);

router.get('/aeropuertos/:ciudad',[
    check("ciudad", "Ciudad requerida").not().isEmpty(),
    validarCampos
], vuelosController.getAeropuertos)

router.get('/recomendados/:destino',[
    check("destino", "Destino requerido").not().isEmpty(),
    validarCampos
], vuelosController.getVuelosRecomendados)


module.exports = router;