require("dotenv").config();
var Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
})

const db = require('../mysql');
const fs = require('fs').promises; //librería de node para trabajar con el sistema de ficheros
const path = require('path'); 

const {formatDateToDb} = require ('../helpers/helpers');

const getVuelos = async(req, res) => {

    console.log(req.body)
   
    const {origen, destino, fecha_salida, fecha_vuelta, directo, precio, idavuelta, n_personas} = req.body

    try{
    
        let sql = `SELECT *, DATE_FORMAT(v.fecha_salida, "%d-%m-%Y") as formato_fecha  
                       FROM vuelo v, aerolinea a 
                      WHERE a.codigo = v.aerolinea_id
                        AND v.origen = "${origen}"
                        AND  v.destino = "${destino}"
                        AND v.n_personas =${n_personas}`;
                        
                    if(fecha_salida){
                        let nuevaFecha = formatDateToDb(fecha_salida);
                        sql += ` AND v.fecha_salida = '${nuevaFecha}'`;
                    }
                    if(fecha_vuelta){
                        let nuevaFecha = formatDateToDb(fecha_vuelta);
                        sql += ` AND v.fecha_vuelta = '${nuevaFecha}'`;
                    }
                    if(directo === "s"){
                        sql += ` AND v.escalas = 0`;  
                    }
                    if(precio){
                        sql += ` AND v.precio <= ${precio}`;
                    }
                    if(idavuelta === "s"){
                        sql += ` AND v.vuelta IS NOT NULL`;
                    }

                   sql += ` ORDER BY v.precio ASC`;

                   console.log(sql)
          
        let response = await db.performQuery(sql);
        
         
        if(!response){
            console.log(err)
            return res.status(400).send({
                ok: false,
                message: 'Error al realizar la consulta',
              
            })    
        }

        if(response.length === 0){
            
            return res.status(200).send({
                ok: false,
                message: 'No se han encontrado vuelos'
            });
        }
        
       
        return res.status(200).send({
            ok: true,
            data: response
        });

    }catch(e){
        console.log(e)
    }
}

const getVueloById = async(req, res) => {


    const { id } = req.params;


    try{
    
        let sql = `SELECT *, DATE_FORMAT(v.fecha_salida, "%d-%m-%Y") as formato_fecha  
                       FROM vuelo v, aerolinea a 
                      WHERE a.codigo = v.aerolinea_id 
                        AND v.id = ?`;
        

        let response = await db.performQuery(sql, id);

            //console.log(vuelos)
            
            if(!response){
                console.log(err)
                return res.status(500).send({
                    ok: false,
                    message: 'Error interno del servidor',
                });
            }else{
                if(response.length > 0){
                    return res.status(200).send({
                        ok: true,
                        data: response
                    });
                }else{
                    return res.status(200).send({
                        ok: false,
                        message: 'No se han encontrado vuelos'
                    });
                }    
            }    
    
        

    }catch(e){
        console.log(e);
    }
}

const getVuelosRecomendados = async(req, res) => {


    const { destino } = req.params;


    try{
    
        let sql = `SELECT *, DATE_FORMAT(v.fecha_salida, "%d-%m-%Y") as formato_fecha  
                       FROM vuelo v, aerolinea a 
                      WHERE a.codigo = v.aerolinea_id
                        AND  v.destino = "${destino}"`;
            

        let response = await db.performQuery(sql, [destino]);
        
         
        if(!response){
            console.log(err)
            return res.status(500).send({
                ok: false,
                message: 'Error interno del servidor',
              
            })    
        }

        if(response.length === 0){
            
            return res.status(404).send({
                ok: false,
                message: 'No se han encontrado vuelos'
            });
        }
        
       
        return res.status(200).send({
            ok: true,
            data: response
        });

    }catch(e){
        console.log(e)
    }
}

const getAeropuertos = (req, res) => {
    
    const {ciudad} = req.params;

    try{

        const sql = 'SELECT * FROM aeropuerto WHERE ciudad = ?';
        
        db.query(sql,[ciudad], (err, aeropuerto) => {
            if(err){
                return res.status(400).send({
                    ok: false,
                    message: 'Error en la consulta del aeropuerto'
                });
            }else{
                if(aeropuerto){
                    return res.status(200).send({
                        ok: true,
                        aeropuerto
                    });
                }else{
                    return res.status(400).send({
                        ok: false,
                        message: 'No hay aeropuertos'
                    });
                }    
            }    
        })
        
    }catch(e){
        console.log(error);
    }

}

const getDestinosMasReservados = async(req, res) => {

   

    await amadeus.travel.analytics.AirTraffic.Booked.get({
        originCityCode: 'MAD',
        period: '2018-08'
      }).then(result => console.log(result)).catch(error => console.log(error))

     /* if(!respuesta){
          return res.status(404).send({
              ok: false,
              message: 'No se ha enconctrado nada'
          })
      }

      console.log(respuesta)
    return res.send({
        respuesta
    });  */

}

const getImage = async(req, res) => {

    const { filename } = req.params;
        
    const file_path = `./uploads/logos/${filename}`;

    try{

        const existe = await fs.stat(file_path);
            
        return res.sendFile(path.resolve(file_path));
     
    }catch(e){
        console.log(e)
        return res.status(404).send({
            ok: false,
            message: 'La imagen no existe'
        });
    }

}

const getHotels = async(req, res) =>{
    
    let response = await amadeus.shopping.hotelOffers.get({
        cityCode: 'PAR'
    })

    res.send({
        response
    })
}

module.exports = {
    getVuelos,
    getVueloById,
    getVuelosRecomendados,
    getAeropuertos,
    getDestinosMasReservados,
    getImage,
    getHotels
}










/*

export const getAirportByCode = ( code ) => aeropuertos.find( airport => airport.iataCode === code);

export const getAirportByCity = ( city ) => aeropuertos.filter( airport => airport.address.cityName === city);
    
export const getCitiesWithAirport = () => aeropuertos.map( city => city.name);

*/
