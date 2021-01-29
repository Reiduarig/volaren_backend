const express = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {

    //Validar los datos
    const errors = validationResult(req); 
    
    if(!errors.isEmpty()){
        return res.status(400).send({
            ok: 'false',
            errors: errors.mapped()        
        });
    }

    next();
}

module.exports = { validarCampos } 