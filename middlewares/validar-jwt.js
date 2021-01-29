const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next ) => {
    
    //recoger el token recibido en x-token en headers
    const token = req.header('x-token');

    //validar el token
    if(!token){
        return res.status(401).send({
            ok: false,
            message: 'Token no recibido en los headers de la petición'
        })
    }

    try{
        
        //extraer el uuid del payload para conocer de que usuario se trata, se pasan como argumentos el token recibido y nuestra clave secreta del mismo
        //este método retornará el uid, nombre y expiracion, desestructuramos para recojer los campos que necesitamos
        const { uid , name } = jwt.verify(token, process.env.TOKEN_KEY_SECRET);

        //extraer los campos que necesitamos y se pasarán
        //modificamos la request para ser pasada como referencia a cualquier función que siga despues de la llamada a next
        
        req.uid = uid;
        req.name = name;
    
    }catch(error){
        return res.status(401).send({
            ok: false,
            message: 'Token no válido'
        })
    }

    next();
}

const hasAPIKey = async (req, res, next) => {
    if (!req.query.key || req.query.key !== '999111222') {
        res.status(401).send('api key error')
        return
    }

    next()
}

const isAuthenticated = async (req, res, next) => {
    // obtengo el token que habrán metido en 
    // las cabecera
    const { authorization } = req.headers;

    try {
        // si la verificación del token falla (caducado, mal formado, no descifrable
        // con el SECRET dado) salta una excepción
        const decodedToken = jwt.verify(authorization, process.env.SECRET);

        const user = await db.getUser(decodedToken.email)

        if (!user) {
            throw new Error()
        }

        req.auth = decodedToken;
    } catch (e) {
        res.status(401).send()
        return

        //        const authError = new Error('invalid token');
        //        authError.status = 401;
        //        return next(authError);
    }

    next();
}

/*
    Este middleware comprueba que el campo auth 
    (previamente creado en el middleware isAuthenticated
    a partir del token descifrado) es igual al role
    que nos interesa

    Si hubiera muchos roles podríamos tener un middleware isXXX
    por cada uno de ellos
*/
const isAdmin = (req, res, next) => {
    if (!req.auth || !req.auth.isAdmin) {
        res.status(403).send()
        return
        //        const authError = new Error('not-authorized');
        //        authError.status = 403;
        //        return next(authError);
    }

    next();
}

const isSameUser = (req, res, next) => {
    // ¿Es el mismo usuario cuando el recurso sobre el que queremos
    // actuar (/user/:id) es el mismo que el que viene codificado en el token?
    // Es decir, cuando desciframos el token, obtenemos el JSON original que se 
    // cifró en el proceso de autenticación. En dicho JSON viene información
    // de usuario, como su correo electrónico (que en nuestro sistema es su 
    // identificador). Por tanto isSameUser llamará a next() cuando el correo
    // electrónico de ese JSON sea igual al identificador del usuario
    // que nos pasan en la URL.
    
    // En otras palabras, vamos a comprobar que el ID de la URL es igual
    // al email que está en req.auth, obtenido de descibrar el token
    // en un middleware previo (en el isAuthenticated)
    const { id } = req.params;

    if (id === req.auth.email || req.auth.isAdmin) {
        next()
    } else {
        res.status(403).send()
        return
    }
}


module.exports = {
    validarJWT
}