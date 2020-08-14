import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// El providedIn es una forma automática de importar servicios.
@Injectable({
  providedIn: 'root',
})
export class LugaresSearchUbicacionService {
  constructor(private http: HttpClient) {}

  obtenerLugar(word_search: string) {
    return this.http.get(
      `http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=ARG&text=${word_search}&category=City`
    );
  }
}
