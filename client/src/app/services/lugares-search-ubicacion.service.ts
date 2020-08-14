import { Injectable } from '@angular/core';

// El providedIn es una forma automática de importar servicios.
@Injectable({
  providedIn: 'root',
})
export class LugaresSearchUbicacionService {
  // Propiedad privada para que no pueda ser accesada fuera del servicio
  private lugares: any[] = ['GBA', 'Costa Atlántica', 'CABA'];

  constructor() {}

  //  Creamos un método público para que las propiedades puedan ser accedidas desde los componentes.
  getLugares() {
    return this.lugares;
  }
}
