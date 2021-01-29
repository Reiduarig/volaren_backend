'use strict'

const express = require('express');
const { check } = require("express-validator");

const emailController = require('../controllers/email');

const router = express.Router();

/* -----------  Rutas ----------------------*/

router.post('/',[
                        check("email", "Email requerido").isEmail(),
                        check("title", "Title requerido").not().isEmpty(),
                        check("content", "Content requerido").not().isEmpty()
                    ],
                    emailController.envioEmail);

module.exports = router;