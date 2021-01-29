'use strict'

//importar módulos jwt y moment
const jwt = require('jsonwebtoken');
const moment = require('moment');

const createToken = ( uid, name ) => {
    
    //retornar una promesa

        //crear el payload
        const payload = { uid, name }; 
        //generar el token pasando el payload, la clave secreta y las opciones de firma o alteracion de expiracion
        const genToken =  jwt.sign(payload, process.env.TOKEN_KEY_SECRET, {expiresIn: '2h'});
        const token =  genToken;
        return token ;
   
}

module.exports = {
    createToken
}