require('dotenv').config();
const express = require('express');
const http = require('http');

const morgan = require('morgan');
//traduce los parametros enviados en el body y lo expone en el objeto req.body
const bodyParser = require('body-parser');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001;

        //Http server
        this.server = http.createServer(this.app);
        
    }

    middlewares() {
        
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.static('public'));
        this.app.use(morgan('dev'));

        //CORS
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
    }

    routes() {
        //Reescribir rutas añadiendole /api delante para la api
        this.app.use('/api/auth', require('./routes/auth') );
        this.app.use('/api/users', require('./routes/user') );
        this.app.use('/api/facturacion', require('./routes/facturacion') );
        this.app.use('/api/vuelos', require('./routes/vuelos') );
        this.app.use('/api/reserva', require('./routes/reserva') );
        this.app.use('/api/email', require('./routes/email') );

    }

    initServer() {

        //inicializar middlewares
        this.middlewares();

        //inicializar las rutas
        this.routes();

        //inicializar server
        this.server.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;


//ejemplo de middleware propio para la comprobación de envio de la api key suministrada por nosotros
        //para controlar el acceso de la peticiones de los usuarios
       /*this.app.use((req, res, next) => {
            if(!req.query.key || req.query.key !== '9999999999'){
                res.status(401).send('api key error');
                return;
            }
            next();
        })*/