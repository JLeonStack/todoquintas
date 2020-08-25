import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private url = 'https://todoquintas-arg.firebaseio.com';

  constructor(private http: HttpClient) {}

  publicarPropiedad(propiedad) {
    return this.http.post(`${this.url}/propiedades.json`, propiedad);
  }
}
