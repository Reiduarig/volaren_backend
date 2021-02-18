"use strict";

const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const multipart = require("connect-multiparty");

//middleware
let md_upload = multipart({ uploadDir: "./uploads/posts" }); //ruta donde se van a guardar todas las imagenes de los posts
const { validarCampos } = require("../middlewares/validation");

const blogController = require("../controllers/blog");

router.get("/", blogController.getPosts);

router.get(
  "/:id",
  [check("id", "Id de post requerida").not().isEmpty()],
  blogController.getPost
);

router.get(
  "/search/:search",
  [check("search", "Palabra de búsqueda requerida").not().isEmpty()],
  blogController.getPostsBySearch
);

router.post(
  "/create",
  [
    check("id", "Usuario requerido").not().isEmpty(),
    check("title", "Título requerido").not().isEmpty(),
    check("description", "Descripción requerida").not().isEmpty(),
    validarCampos,
  ],
  blogController.createPost
);

router.put(
  "/:id",
  [
    check("id", "Id de post requerida").not().isEmpty(),
    check("title", "Título requerido").not().isEmpty(),
    check("description", "Descripción requerida").not().isEmpty(),
    validarCampos,
  ],
  blogController.createPost
);

router.delete(
  "/:id",
  [check("id", "Id de post requerida").not().isEmpty()],
  blogController.deletePost
);

router.get(
  "/image/:filename",
  [check("filename", "Nombre de archivo requerido").not().isEmpty()],
  blogController.getImage
);

module.exports = router;
