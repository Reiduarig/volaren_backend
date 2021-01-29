const { sendMail/*, validateEmail */} = require('../helpers/helpers');

const envioEmail = async(req, res) =>{
    
    const { email, asunto, contenido } = req.body;


    //validación de los parámetros recibidos
   /* let valida = validateEmail(email, asunto, contenido);
    
    if( valida ){*/

        try{

            await sendMail({
                email: email,
                title: asunto,
                content: contenido
            });

            res.status(200).send({
                ok: true,
                message: 'El email ha sido enviado correctamente'
            })

        }catch(error){
            console.error(error);
            res.status.send({
                ok:false,
                message: 'No se ha podido enviar el email',
                error: error
            })
        }

    /*}else{
        res.status(400).send({
            ok: false,
            message: 'Datos enviados incorrectos'
        });
    }     */
}

module.exports = { envioEmail };