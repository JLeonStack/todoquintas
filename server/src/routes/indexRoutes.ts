// Importo express
import { Router } from 'express';

class IndexRoutes {
  // Instancio la clase Router
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    //   Creo una ruta
    this.router.get('/', (req, res) => {
      res.send('api/v1');
    });
  }
}

// Instancio la clase
const indexRoutes = new IndexRoutes();

// Exporto el enrutador.
export default indexRoutes.router;
