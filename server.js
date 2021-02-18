require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
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
        this.app.use(cors());
    }

    routes() {
        //Reescribir rutas añadiendole /api delante para la api
        this.app.use('/api/auth', require('./routes/auth') );
        this.app.use('/api/users', require('./routes/user') );
        this.app.use('/api/facturacion', require('./routes/facturacion') );
        this.app.use('/api/vuelos', require('./routes/vuelos') );
        this.app.use('/api/reserva', require('./routes/reserva') );
        this.app.use('/api/email', require('./routes/email') );
        this.app.use('/api/posts', require('./routes/blog') );

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

