import { Injectable } from '@angular/core';

// Importo http
import { HttpClient } from '@angular/common/http';

// Importo firestore
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

//Modelo de datos
import { Busqueda } from '../models/busqueda.model';
import { PropiedadIndividualGetModel } from '../models/propiedad.model';

import { Observable, BehaviorSubject } from 'rxjs';

// El providedIn es una forma automática de importar servicios.
@Injectable({
  providedIn: 'root',
})
export class LugaresSearchUbicacionService {
  // Seteo una propiedad del tipo FirestoreCollection
  private propiedadesCollectionRef: AngularFirestoreCollection;

  public provincias: string[] = [
    'Buenos Aires',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán',
  ];

  ubicacion_des: { ciudad: string; provincia: string } = {
    ciudad: '',
    provincia: '',
  };

  public propiedades: BehaviorSubject<PropiedadIndividualGetModel[]>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.propiedades = new BehaviorSubject<any>(false);
  }

  // La siguiente función se encarga de devolver las sugerencias en base a las letras ingresadas por el usuario en el input search.
  obtenerLugar(word_search: string) {
    return this.http.get(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&countryCode=ARG&text=${word_search}&category=City`
    );
  }

  conexiónFirebase() {
    // A continuación creo una referencia a la colección usuarios
    this.propiedadesCollectionRef = this.firestore.collection('propiedades');
  }

  // La siguiente función se encargará de verificar si existe una conexión a firebase. Si existe, no establecerá una nueva. De esta manera evitamos abrir múltiples conexiones sin usar.
  verificarConexionFirebase() {
    if (!this.propiedadesCollectionRef) {
      // console.log('Se ha creado la conexión a firebase');
      this.conexiónFirebase();
    }
  }

  // Con el siguiente método obtendré las diferentes propiedades alojadas en la base de datos.
  getPropiedad(busqueda: Busqueda) {
    this.verificarConexionFirebase();

    this.procesarUbicacion(busqueda.ubicacion);

    this.propiedadesCollectionRef.ref
      .where('propiedad.provincia', '==', `${this.ubicacion_des.provincia}`)
      .get()
      .then((doc) => {
        if (!doc.empty) {
          // Creo una variable temporal denominada array, para almacenar las propiedades que devuelva la consulta.
          let array_propiedades = [];

          // Recorro el documento que devuelve la base datos.
          doc.forEach((data) => {
            // Pregunto si existe información en cada uno de los documentos de propiedades que estoy recorriendo
            if (data.exists) {
              // Agrego como dato extra al objeto el id del documento, o propiedad.
              array_propiedades.push({
                ...data.data(),
                propiedad_id: data.id,
              });
            }
            // Si la cantidad de documentos coincide con la cantidad de propiedades en el array, procedo a resolver la promesa, retornando la información a la vista.
            if (array_propiedades.length == doc.size) {
              this.setPropiedades(array_propiedades);
            }
          });
        } else {
          this.setPropiedades([]);
        }
      });
  }

  // La siguiente función se encargará de procesar la ubicación de manera tal de poder enviar como consulta a firebase la provincia y la ciudad de las propiedades.
  procesarUbicacion(ubicacion: string) {
    let ubicacion_v = ubicacion.split(',');
    console.log(ubicacion_v);
    for (let i = 0; i < this.provincias.length; i++) {
      for (let j = 0; j < ubicacion_v.length; j++) {
        if (ubicacion_v[j].trim() == this.provincias[i].trim()) {
          this.ubicacion_des.provincia = this.provincias[i].trim();
        }
      }
    }
    this.ubicacion_des.ciudad = ubicacion[0].trim();
  }

  setPropiedades(array_propiedades: PropiedadIndividualGetModel[]): void {
    this.propiedades.next(array_propiedades);
  }
  getPropiedades(): Observable<PropiedadIndividualGetModel[]> {
    return this.propiedades.asObservable();
  }
}
