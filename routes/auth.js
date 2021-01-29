const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

let authController = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validation");
const { validarJWT } = require('../middlewares/validar-jwt');

router.post("/register",
  [
    check("username", "Nombre requerido").not().isEmpty(),
    check("email", "Email requerido").isEmail(),
    check("password", "Password requerida").not().isEmpty(),
    validarCampos,
  ],
  authController.register
);
router.post("/login",
  [
    check("email", "Email requerido").isEmail(),
    check("password", "Password requerida").not().isEmpty(),
    validarCampos,
  ],
  authController.login
);
/**
 * Validar el registro de un usuario
 */

router.get("/validate/:code", authController.validate);

router.get("/renew", validarJWT ,authController.renovarToken);

module.exports = router;
