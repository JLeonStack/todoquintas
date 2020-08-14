// Importo express
import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Importo rutas
import indexRoutes from './routes/indexRoutes';

class Server {
  // Propiedad de la clase
  public app: Application;
  // El constructor es un método que se ejecuta ni bien instaciamos la clase.
  constructor() {
    this.app = express();

    // Ejecuto los métodos para configurar app.
    this.config();
    this.routes();
  }

  //   Este método configurará el servidor
  config(): void {
    //   Configuro una variable en app denominada port con la siguiente configuración
    this.app.set('port', process.env.PORT || 3000);

    // Implemento morgan para ver las peticiones http.
    this.app.use(morgan('dev'));

    // Implemento cors
    this.app.use(cors());

    // Permite que mi servidor entienda los formatos json provenientes de la aplicación angular.
    this.app.use(express.json());

    // Permito el envío de datos a través de formularios.
    this.app.use(express.urlencoded({ extended: false }));
  }

  //   Este método configurará las rutas
  routes(): void {
    //   Importo el controlador de rutas. Y establezco una secuencia /api/v1 inicial, que tendrán todas las rutas que pedirán información
    this.app.use('/api/v1/', indexRoutes);
  }

  start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server on port ${this.app.get('port')}`);
    });
  }
}

// Instancia la clase server con todos sus respectivos métodos en la variable server.
const server = new Server();

// Ejecuto el método start, que iniciaará el servidor.
server.start();
