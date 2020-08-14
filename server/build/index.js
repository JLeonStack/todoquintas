"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importo express
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Importo rutas
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
class Server {
    // El constructor es un método que se ejecuta ni bien instaciamos la clase.
    constructor() {
        this.app = express_1.default();
        // Ejecuto los métodos para configurar app.
        this.config();
        this.routes();
    }
    //   Este método configurará el servidor
    config() {
        //   Configuro una variable en app denominada port con la siguiente configuración
        this.app.set('port', process.env.PORT || 3000);
        // Implemento morgan para ver las peticiones http.
        this.app.use(morgan_1.default('dev'));
        // Implemento cors
        this.app.use(cors_1.default());
        // Permite que mi servidor entienda los formatos json provenientes de la aplicación angular.
        this.app.use(express_1.default.json());
        // Permito el envío de datos a través de formularios.
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    //   Este método configurará las rutas
    routes() {
        //   Importo el controlador de rutas. Y establezco una secuencia /api/v1 inicial, que tendrán todas las rutas que pedirán información
        this.app.use('/api/v1/', indexRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server on port ${this.app.get('port')}`);
        });
    }
}
// Instancia la clase server con todos sus respectivos métodos en la variable server.
const server = new Server();
// Ejecuto el método start, que iniciaará el servidor.
server.start();
