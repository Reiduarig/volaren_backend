require('dotenv').config()


const db = require('../mysql');
const sendgrid = require('@sendgrid/mail'); 
const fs = require('fs').promises;
const uuid = require('uuid');
const path = require('path');
const sharp = require('sharp');
const dateFormat = require('dateFormat');
const pdf = require('html-pdf');

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

const sendMail = ({ emailPrueba, tituloPrueba, contenidoPrueba }) => {
    
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to: emailPrueba,
        from: process.env.SENDGRID_EMAIL,
        subject: tituloPrueba,
        text: contenidoPrueba,
        html: `<div
                <h1>${ tituloPrueba }</h1>
                <p>${ contenidoPrueba }</p>
                </div>`
    };
    
    sendgrid
        .send(msg)
        .then(() => console.log("email enviado") , error => {
            
            console.error(error);
            console.log(msg);
 
            if (error.response) {
                console.error(error.response.body)
            }
        });
}

const sendConfirmationMail = async( email, link ) => {
    
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

        const message = {
            to: email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Validación de cuenta',
            text: `La dirección de verificación es: ${link}`,
            html: `
            <div>
              <h1> Valida tu registro </h1>
              <p> Si te has registrado en el sistema, accede al siguiente
              enlace para validar tu cuenta </p>
    
              ${link}
            </div>
          `,
        };
    
       
        await sendgrid.send(message);
}


const formatDateToDb = (date) => {
    let day = dateFormat(date,"yyyy-mm-dd")
    return day;
}

//Guardar una imagen y obtener el nombre
const processAndSaveImage = async(uploadedImage) => {
    // Random File name to be saved
    const savedFileName = `${uuid.v1()}.jpg`;
    // Create the upload path
    await fs.mkdir(imageUploadPath, { recursive: true });
    // Process image
    const finalImage = sharp(uploadedImage.data);
    // Check image size
    const imageInfo = await finalImage.metadata();
    // If image is wider than 500px resize it
    if (imageInfo.width > 800) {
        finalImage.resize(800);
    }
    // Save image
    await finalImage.toFile(path.join(imageUploadPath, savedFileName));

    return savedFileName;
}

const deleteFile = async(image) => {
    await fs.unlink(path.join(imageUploadPath, image))
}

const createPDF = async(idReserva, tipoFormato) => {

    let content = '';
    let ruta = 'reservas'

    let sql = `SELECT * FROM vuelo v, reserva r, pasajeros_reserva pr
                           WHERE v.id = r.vuelo_id
                           AND pr.reserva_id = r.id 
                           AND r.id = ?`;

    let response = await db.performQuery(sql, [idReserva]);

   
    
    
    const { nombre, apellido1, apellido2, aerolinea_id, reserva_id, origen, destino, fecha, vuelo_id, hora_salida, hora_llegada, contacto_email, contacto_telefono} = response[0];
    
    //contenido del pdf
    if(tipoFormato === 'Reserva'){
        
        ruta = 'reservas'
        content = `
        <!doctype html>
        <html>
        <head>
                <meta charset="utf-8">
                <title>PDF Result Template</title>
                <style>
                body{
                    background: black;
                }
                #formato{
                    width: 60%;
                    margin:auto;
                    padding:20px;
                    background: #fff;
                    border-radius: 5px;
                }
                #cabecera{
                    padding:20px 0;
                }
                #formato-body{
                    min-height:400px;
                  border: 1px solid lightgrey;
                  padding:80px 20px;
                  }
                #formato-body h1{
                    color:navy;
                }
                #formato-body h2{
                    color:red;
                    margin-bottom:80px;
                }
                #formato-body span{
                    width:100px;
                    font-weight: 600;
                    border-bottom: 1px solid black;
                }
                #formato-body table{
                    width:400px;
                    margin-top:50px;
                    text-align:center;
                }
                #formato-body table th{
                    padding:10px 0;
                    border-bottom: 1px solid black;
                }
                #formato-body table td{
                    padding:10px 0;
                    
                }
                #formato-footer{
                 
                    margin-top:40px;
                   border: 1px solid lightgrey;
                  padding:20px;
                }
                #formato-footer span{
                    margin-top:40px;
                    font-weight: 600;
                    border-bottom: 1px solid black;
                  
                }
                    
                </style>
            </head>
            <body>
                <div id="formato">
                    <div id="cabecera">
                        <img width="80" height="80" src="./uploads/logoVolarem.png" alt="logo"/>   
                    </div>
                    <div id="formato-body">	
                        <h1>Ryanair</h1> 
                        <h2>Tu billete electrónico e itinerario</h2>
                        <span>Datos pasajeros</span>
                        <p>${nombre} ${apellido1} ${apellido2} 34268216x</p>
                        
                        <span>Número de reserva</span>
                        <p>${aerolinea_id}${reserva_id}</p>
                        <span>Datos de los vuelos</span>
                        <table>
                            <thead>
                                <tr>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Vuelo</th>
                                <th>Salida</th>
                                <th>Llegada</th>
                                <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${origen}</td>
                                    <td>${destino}</td>
                                    <td>${aerolinea_id}${vuelo_id}</td>
                                    <td>${hora_salida}</td>
                                    <td>${hora_llegada}</td>
                                    <td>Confirmada</td>
                                </tr>
                            </tbody>
                        </table>	
                    </div>
                    <div id="formato-footer">	
                        <span>Datos de contacto</span>
                        <p>Email: ${contacto_email}</p>
                        <p>Teléfono: ${contacto_telefono}</p>
                    </div>
                </div>
                
            </body>
        </html>
            `;
    }else if(tipoFormato === 'Transporte'){

        ruta = 'otros';
        tipoFormato = 'Transporte';
        content = `
        <!doctype html>
        <html>
        <head>
                <meta charset="utf-8">
                <title>PDF Result Template</title>
                <style>
                    body{
                        background: white;
                    }
                    #formato{
                        width: 80%;
                        margin:auto;
                        padding:20px;
                        background: #fff;
                        border-radius: 5px;
                    }
                    #cabecera{
                        padding:20px 0;
                    }
                    #formato-body{
                        min-height:400px;
                      }
                    #formato-body h2{
                        color:black;
                        margin-bottom:80px;
                    }
                    #formato-body span{
                        width:100px;
                        font-weight: 600;
                        border-bottom: 1px solid black;
                    }
                    
                    #formato-footer{
                        margin-top:40px;
                    }
                    #formato-footer span{
                        margin-top:40px;
                        font-weight: 600;
                        border-bottom: 1px solid black;
                    }
                    
                </style>
            </head>
            <body>
                <div id="cabecera">
                    <img width="80" height="80" src="./uploads/logoVolarem.png" alt="logo"/>
                </div>
                <div id="formato-body">	
                    <h2>Reserva de Shuttle para el aeropuerto de ${destino}</h2>
                    <p>A fecha de: ${formatDateToDb(fecha)}</p>
                    <p>Los transportes desde el aeropuerto al destino se realizan cada 30 mts desde la estación de buses ubicada en la salida de la terminal</p>  
             </body>
            </html>`;
    }
      
        try {

            
            
            let result = null;
            //se crea el documento pdf
           await pdf.create(content).toFile(`./uploads/documents/reservas/${tipoFormato}${destino}${reserva_id}.pdf`, async function(err, res) {
            
                if (err){
                    result =  err;
                
                } else {
                    result =  res;
                    const {filename} = result; 
                    //desestructuramos la ruta para obtener solo el nombre
                    let file_path = filename;
                    let file_split = file_path.split('\\'); //separar los segmentos de la ruta
                    let documento = file_split[6]; //nombre            
                    
                    // insertamos el pdf creado para esa reserva
                   let sql2 = 'INSERT INTO documentos(reserva_id, descripcion, tipo, url) values (?,?,?,?)';

                   const descripcion = `${tipoFormato} a ${destino}  ${formatDateToDb(fecha)}`;

                   let response2 = await db.performQuery(sql2,[reserva_id, descripcion, tipoFormato, documento]);
                
                  
                }

            return result;
           })
        } catch (e) {
            throw new Error(e)
    
        } 
     
     
       
  
}



module.exports = {
    sendMail,
    sendConfirmationMail,
    formatDateToDb,
    processAndSaveImage,
    deleteFile,
    createPDF
};

 