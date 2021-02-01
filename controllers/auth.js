const db = require('../mysql');
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const { createToken } = require('../services/jwt');
const {sendConfirmationMail, sendMail} = require("../helpers/helpers");

const register =  async(req, res) => {
 
  //Recoger los parámetros de la peticion
  const { username, email, password } = req.body;


    //comprobamos si el usuario ya existe
    let response = await db.getUser(email, username);

    if(response.length > 0){
      return res.send({
        ok: false,
        message: 'El usuario ya existe'
      });

    }
    //cifrar las pass
    const hash = await bcrypt.hash(password, 10);

    // Generamos un string aleatorio para identificar a este usuario
    // únicamente a efectos de validación
    const validation_code = randomstring.generate(40);


    await db.register(username, email, hash, validation_code);

    // Enviar un correo eléctronico: si el usuario
    // de verdad es quien dice ser, podrá acceder a dicho correcto
    sendConfirmationMail(email, `http://${process.env.PUBLIC_DOMAIN}/api/auth/validate/${validation_code}`)

    return res.status(200).send({
      ok: true,
      message: 'Usuario registrado'
    })
  
}

const validate = (req, res) => {
  
  const { code } = req.params;

    try {
        db.checkValidationCode(code)
        res.send('Validado correctamente')

    } catch(e) {
        res.status(401).send('Usuario no validado')
    }

}

const login = async(req, res) => {
  //Recoger parametros de la peticion
  const { email, password } = req.body;
  
  try{
    
        const user = await db.getUser(email);
        console.log(user.length)
        
        if (user.length == 0) {
          return res.status(200).send({
            ok: false,
            message: 'El usuario no existe'
          })
        }
        

        const validPassword = await bcrypt.compare(password, user[0].password);

        if (!validPassword) {
          return res.status(200).send({
            ok: false,
            message:'Las credenciales no son válidas'
          })
        }

        //Si es correcto, generar token jwt y devolverlo
        const token = createToken(user[0].id, user[0].username);
          
        return res.status(200).send({
            ok: true,
            message: "Login correcto",
            id: user[0].id,
            name: user[0].username,
            image:user[0].imagen,
            token: token
        });

  }catch(error){
       console.log(error.message)
        res.status(500).send({
            ok: false,
            message: "Error interno del servidor"
        })
  }
}

//verificar el jwt actual y actualizarlo para prolongarlo por el tiempo que se habia definido
const renovarToken = async(req, res) => {
 
  //recojer el uid y el nombre en la req que se habia modificado en el middleware
  const { uid, name } = req;

  //generar el nuevo token utilizando el servicio y retornarlo en la respuesta

  const token = await createToken(uid, name);
  
      res.json({
        ok: true,
        token: token
      });

};

module.exports = {
  register,
  login,
  validate,
  renovarToken,
};
