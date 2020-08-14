"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importo express
const express_1 = require("express");
class IndexRoutes {
    constructor() {
        // Instancio la clase Router
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //   Creo una ruta
        this.router.get('/', (req, res) => {
            res.send('api/v1');
        });
    }
}
// Instancio la clase
const indexRoutes = new IndexRoutes();
// Exporto el enrutador.
exports.default = indexRoutes.router;
