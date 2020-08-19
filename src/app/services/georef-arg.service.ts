import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeorefArgService {
  constructor(private http: HttpClient) {}

  AsignarCoordenadas$ = new EventEmitter<string[]>();
  RecogerCoordenadas$ = new EventEmitter<string[]>();

  obtener_provincia() {
    return this.http.get(`https://apis.datos.gob.ar/georef/api/provincias`);
  }

  obtener_ciudad(ciudad: string) {
    return this.http.get(
      `https://apis.datos.gob.ar/georef/api/municipios?provincia=${ciudad}&max=200`
    );
  }
}
